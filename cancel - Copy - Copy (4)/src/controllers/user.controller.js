import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


// login user access and refresh token
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: true});

        return {accessToken,refreshToken};

    } catch (error) {
        
        throw new ApiError(500, 'something went wrong while generating login user access and refresh token 😑')
    }
};



// user register
const userRegister = asyncHandler( async (req, res)=>{

    // get user data from frontend
    const {userName,fullName,email,password} = req.body;
    console.log(userName,fullName,email,password);

    // Validation
    if([userName,fullName,email,password].some((fields)=> fields.trim()==='')){
        throw new ApiError(400, 'all fields are required')
    }

    // Email Validation


    // check existed user
    const existedUser = await User.findOne({
        $or: [{email},{userName}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with email or username already exist')
    }

    // Image local Path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    };


    // Upload Image in cloud
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
        coverImage: coverImage?.url || ''
    })

    // remove user password and refresh token from response
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    
    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user')
    }

    // return response

    return res.status(201).json(
        new ApiResponse(200, userCreated, 'user registered successfully 😊👈🌸👉😊')
    )
});



// user login
const userLogin = asyncHandler( async (req, res)=>{
     
    //get user login data
    const { userName, email, password} = req.body;

    // email or username
    if(!email || !userName){
        throw new ApiError(400, 'email or username are required')
    }

    // find the user
    const user = await User.findOne({
        $or: [{email},{userName}]
    })
    if(!user){
        throw new ApiError(404, 'user not found')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, 'incorrect password')
    }

    // access and refresh token
    const {accessToken, refreshToken} = generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure  : true
    }

    // send cookies
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            'user logged in🌸'
        )
    )
});


// user logout
const userLogout = asyncHandler( async (req, res)=>{


    // create middleware auth and Route


    // update refresh token and new
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {new: true}
    )

    // options
    const options = {
        httpOnly: true,
        secure  : true
    }

    // return cookies
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200,{},'user logged out👍'))
});




export{
    userRegister,
    userLogin,
    userLogout,
    
};