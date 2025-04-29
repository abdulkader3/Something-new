import  jwt   from  "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


// token generator
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        
        throw new ApiError(500, error?.message || 'Something went wrong while generating access token and refresh token')
    }
};


// user register
const userRegister = asyncHandler( async (req, res)=>{
    
    // get user data for register
    const {userName, fullName, email, password} = req.body;

    // Validation
    if([userName,fullName,email,password].some((fields)=> fields.trim() === '')){
        throw new ApiError(400, 'all fields are required')
    }


    // check existed user 
    const existedUser = await User.findOne({
        $or: [{userName},{email}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with email or username already exist')
    }


    // get files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0]?.path
    }

    // upload files in cloud
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

    // remove password and refresh token
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user 😑 sorry about that sir.')
    }

    // send res
    return res
    .status(201)
    .json( new ApiResponse(
        200,
        userCreated,
        "user registered successfully 🫡sir"
    ))


} );


// user login
const userLogin = asyncHandler( async (req, res)=>{

    // get use login data
    const {userName, email, password} = req.body;

    // email or user name
    if(!userName && !email){
        throw new ApiError(
            400, 'username or email is required'
        )
    }

    // find the user
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })
    if(!user){
        throw new ApiError(404, 'user not found')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, 'password is incorrect')
    }

    // access and refresh token 
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    // get user to login
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    // option
    const option = {
        httpOnly: true,
        secure  : true
    }

    // send response and cookies
    return res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json( new ApiResponse(
        200,
        {user: loggedInUser, accessToken, refreshToken},
        "user logged in successfully 🫡sir"
    ))



} );

// user logout
const userLogout = asyncHandler( async (req, res)=>{
    
    // create middleware auth - router

    // update refresh token 
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {refreshToken: undefined}},
        {new: true}
    )
    // option
    const option = {
        httpOnly: true,
        secure  : true
    }
    // clear cookies
    return res
    .status(200)
    .clearCookie('accessToken', option)
    .clearCookie('refreshToken', option)
    .json( new ApiResponse( 200 , {} , "user logged out successfully 🫡sir"))

} );

// end point for refreshed access token
const refreshedAccessToken = asyncHandler( async (req, res)=>{

    // get refresh token from user device
    const incomingToken = req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ','');
    if(!incomingToken){
        throw new ApiError(401, 'no refresh token')
    }

    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password");
    if(!user){
        throw new ApiError(401, 'token expired')
    }

    // final validation
    if( incomingToken !== user.refreshToken){
        throw new ApiError(401, 'unauthorized request')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const option = {
        httpOnly: true,
        secure  : true
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken},
            'token refreshed 🫡sir'
        )
    )
} );


// get current user data
const currentUser = asyncHandler( async (req, res)=>{

    // inject auth middleware

    // return response
    return res
    .status(200)
    .json( new ApiResponse(200, req.user, 'user data send successfully 🫡sir'))
} );

// change current user password
const changePassword = asyncHandler( async (req, res)=>{

    // get user old and new password
    const {oldPassword, newPassword} = req.body;
    if([oldPassword,newPassword].some((e)=> e.trim() === '')){
        throw new ApiError(400, 'old and new password is required')
    }

    // get the user
    const user = await User.findById(req.user._id);

    // check old pass
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400, "old password is incorrect")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json( new ApiResponse(200, {}, 'Password changed successfully 🫡sir'))

} );

// change current user details
const changeUserDetails = asyncHandler( async (req, res)=>{

    // get detail user want to change
    const {fullName, email} = req.body;
    if([fullName,email].some((e)=> e.trim() === '')){
        throw new ApiError(400, 'full name and email is required')
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: {fullName, email}},
        {new: true}
    )

    return res
    .status(200)
    .json( new ApiResponse(200, user , 'user details updated successfully 🫡sir'))

} );


// change avatar 
const changeAvatar = asyncHandler( async (req, res)=>{

    // get files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    // upload in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);

    // update in DB
    await User.findByIdAndUpdate(
        req.user._id,
        {$set: {avatar: avatar.url}},{new: true}
    )

    // send res
    return res
    .status(200)
    .json( new ApiResponse(200, avatar.url, 'avatar changed 🫡sir'))
} );

// change cover Image
const changeCoverImage = asyncHandler( async (req , res)=>{

    // files local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, 'cover Image is required')
    }

    // upload in cloud
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);

    await User.findByIdAndUpdate(req.user._id, {
        $set: {coverImage: coverImage.url}
    },{new: true} )

    // send res
    return res
    .status(200)
    .json( new ApiResponse(200, coverImage.url, 'cover image changed successfully 🫡sir'))
} );





export{
    userRegister,
    userLogin,
    userLogout,
    refreshedAccessToken,
    currentUser,
    changePassword,
    changeUserDetails,
    changeAvatar,
    changeCoverImage
}