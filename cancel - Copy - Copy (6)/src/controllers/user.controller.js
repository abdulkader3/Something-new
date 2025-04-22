import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


// access and refresh token generator
const generateAccessTokenAndRefreshToken = async( userId ) => {
    try {
        
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating refresh and access token')
    }
};


// user register
const userRegister = asyncHandler( async (req, res)=>{

    // get user data for register
    const {userName, fullName, email, password} = req.body;
    
    //validate 
    if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
        throw new ApiError(400, 'all filed are required')
    }

    // check user already existed
    const existedUser = await User.findOne({
        $or: [{email},{userName}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with username or email already exist')
    }

    // Image or file local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }
    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // upload on cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400, 'avatar is required')
    }

    // create user object -entry in DB
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // check user creation 
    if(!user){
        throw new ApiError(500, 'Something went wrong while registering user 😑')
    }

    // remove user password and refresh token
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    // check user creation 
    if(!userCreated){
        throw new ApiError(500, 'Something went wrong while registering user 😑')
    }


    // send response
    return res.status(200).json(
        new ApiResponse(200, userCreated, 'user registered successfully 🌸👉😊👈🌸')
    )
});


// user login
const userLogin = asyncHandler( async (req, res)=>{

    // get user login data
    const {userName, email, password} = req.body;

    // email or username
    if(!userName && !email){
        throw new ApiError(400, 'username or email is required')
    }

    // find user
    const user = await User.findOne({
        $or: [{email},{userName}]
    })
    if(!user){
        throw new ApiError(404, 'user not found 🤷‍♂️')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, 'Incorrect password')
    }

    // access and refresh token
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // or false for local testing
      }
      console.log('LOGOUT - req.user:', req.user)
      console.log('Cookies on logout:', req.cookies)
      

    // send cookies
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json( new 
        ApiResponse(200,
            {user: loggedInUser, accessToken, refreshToken},
            "user logged in successfully 🌸👉😊👈🌸"
        ),
        
    )



});

// user logout

const userLogout = asyncHandler( async (req, res)=>{
    // create middleware auth

    // now update
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure  : true
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200,{},"user logged Out ()👍"))
})



export{
    userRegister,
    userLogin,
    userLogout
};