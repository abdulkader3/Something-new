import   jwt from 'jsonwebtoken';
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

        return {accessToken, refreshToken};


    } catch (error) {
        
        throw new ApiError(500, 'Something went wrong while generating access token and refresh token ')
    }
};


// user register
const userRegister = asyncHandler( async ( req, res )=>{
    
    // get user data from frontend
    const {userName, fullName, email, password} = req.body;

    // Validation
    if([userName, fullName, email, password].some((fields)=> fields.trim() === '')){
        throw new ApiError(400, 'all fields are required')
    }

    // check existed user
    const existedUser = await User.findOne({
        $or: [{userName},{email}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with username or email already exist')
    }

    // get files or Image local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }
    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path;
    };


    // upload file or Image on cloud
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

    // remove password and refresh token
    const userCreated = await User.findById(user._id).select("-password -refreshToken");


    // check user creation 
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user')
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, userCreated, "user registered successfully 🌸👉😊👈🌸"
        )
    )




});


// user login
const userLogin = asyncHandler( async ( req, res )=>{

    // get user login data
    const {userName, email, password } = req.body;


    // email or username 
    if(!userName && !email){
        throw new ApiError(400, 'username or email is required')
    }


    // find the user
    const user = await User.findOne({
        $or: [{userName},{email}]
    })
    if(!user){
        throw new ApiError(404, "user not found")
    }


    // check password 
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, 'incorrect password')
    }


    // access and refresh token
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
    .json(new ApiResponse(
        200,
        {user: loggedInUser, accessToken, refreshToken},
        "user logged in successfully 🌸👉😊👈🌸"
    ))


});


// user logout
const userLogout = asyncHandler( async (req, res)=>{
    
    //create middleware auth - Routes

    //update refresh token -new
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


    // clear cookies and send response
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json( new ApiResponse(200, {}, "User logged out ()👍 "))


})


// refreshed access token
const refreshedAccessToken = asyncHandler( async (req, res)=>{

    // get refresh token from cookies or body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401, 'Unauthorized request')
    }

    // tryCatch
    try {
        
        // decode token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // get user
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, 'Invalid refresh token')
        }

        // final validation 
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, 'Refresh token already expired or in used')
        }

        // generate new token 
        const {accessToken , refreshToken: newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id);

        // options 
        const options = {
            httpOnly: true,
            secure  : true
        }
        
        // send cookies and response
        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefreshToken, options)
        .json( new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "access token refreshed"
        ))

    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token')
    }
} );



export{
    userRegister,
    userLogin,
    userLogout,
    refreshedAccessToken,
};