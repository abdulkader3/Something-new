import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


// generate access and refresh token
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500, 'something went wrong while generating access token and refresh token')
    }
};


//user register
const userRegister = asyncHandler( async (req, res)=>{

    // get user data
    const {userName, fullName, email, password } = req.body;

    // Validation
    if([userName, fullName, email, password].some((filed)=> filed.trim() === '')){
        throw new ApiError(400, 'all filed are required')
    }

    // check existed user
    const existedUser = await User.findOne({
        $or: [{email},{userName}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with email or username already exist')
    }

    // get Image or files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // upload files on cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, 'avatar is required')
    }

    const coverImage = await UploadOnCloudinary(coverImageLocalPath);

    // create user object - entry in DB
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })

    // remove password and refresh token
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user')
    }

    // send response
    return res.status(201).json(
        new ApiResponse(200, userCreated, 'user registered successfully 🌸👉😊👈🌸')
    )
});

// user login
const userLogin = asyncHandler( async (req, res)=>{

    // get user login data
    const {userName, email, password} = req.body;

    // emil or username
    if(!userName && !email){
        throw new ApiError(400, 'username or email is required')
    }

    // find the user
    const user = await User.findOne({
        $or: [{userName},{email}]
    })
    if(!user){
        throw new ApiError(404, 'user not found')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, 'Incorrect password')
    }

    // assess and refresh token

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

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
            {user: loggedInUser, accessToken, refreshToken},
            "user logged in successfully 🌸😊👍"
        )
    )

});


// user logout
const userLogout = asyncHandler( async (req, res)=>{
    
    // create middleware auth - routes

    // update refresh token - new
    await User.findByIdAndUpdate(
        req.user._id,
        {$set: {refreshToken: undefined}},
        {new: true}
    )

    // options
    const options = {
        httpOnly: true,
        secure  : true
    }

    // send response - clearCookies
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json( new ApiResponse(200, {} , "user logged out ()👍"))


});




export{
    userRegister,
    userLogin,
    userLogout
}