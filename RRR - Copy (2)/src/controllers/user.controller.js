import   jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


// for generate access and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating access token and refresh token')
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
const userLogin = asyncHandler( async (req, res)=>{

    // get user login data
    const {userName, email, password} = req.body;

    // email or username
    if(!userName && !email){
        throw new ApiError(400, 'email or username is required')
    }

    // find user
    const user = await User.findOne({
        $or: [{userName},{email}]
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
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure  : true
    }

    // send res and cookies
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {user: loggedInUser, accessToken, refreshToken},
            'user logged in successfully 🫡sir'
        )
    )
} );


// user logout
const userLogout = asyncHandler( async (req, res)=>{

    // create middleware auth - and routes

    // update refresh token -new
    await User.findByIdAndUpdate(
        req.user._id,
        {$set: {refreshToken: undefined}},{new: true}
    )

    // options
    const options = {
        httpOnly : true,
        secure   : true
    }


    // clear cookies
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200,{},"user logged out 🫡sir"))

} );

// refreshed access token
const refreshedAccessToken = asyncHandler( async (req, res)=>{

    const incomingRefreshToken = req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');

    if(!incomingRefreshToken){
        throw new ApiError(401, 'Unauthorized request')
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
 
     const user = await User.findById(decodedToken?._id).select('-password');
     if(!user){
         throw new ApiError(401, 'refresh token not found')
     }
 
     // final validation
     if( incomingRefreshToken !== user.refreshToken){
         throw new ApiError(401, 'Refresh token expired')
     }
 
     // get token
     const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
 
     const options = { 
         httpOnly: true,
         secure  : true
     }
     // send response
     return res
     .status(200)
     .cookie('accessToken', accessToken, options)
     .cookie('refreshToken', refreshToken, options)
     .json( new ApiResponse(200, {accessToken, newRefreshToken: refreshToken},
         "user access token refreshed 🫡sir"
      ) )
   } catch (error) {
    throw new ApiError(401, error?.message || 'something went wrong while refreshing access token')
   }


} );

// get current user
const getCurrentUser = asyncHandler( async (req, res)=>{

    // inject middleware -VerifyJWT
    
    // return response
    return res
    .status(200)
    .json(new ApiResponse(200, req?.user || 'user not logged in', 'current user data send successfully' ))
} );

// change password
const changePassword = asyncHandler( async (req, res)=>{

    // get user old password and new password they want
    const {oldPassword , newPassword} = req.body;


    // validation
    if([oldPassword,newPassword].some((e)=> e.trim() === '')){
        throw new ApiError(400, 'we need your old and new password')
    }

    // user
    const user = await User.findById(req.user?._id);

    // check old password is correct
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400, 'incorrect old password')
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    // send response
    return res
    .status(200)
    .json(new ApiResponse( 200, {} , 'user password been changed successfully 🫡sir'))


} );

// change account details
const changeAccountDetails = asyncHandler( async (req, res)=>{

    // get data user want to change
    const {fullName, email} = req.body;
    if(!fullName || !email){
        throw new ApiError('fields can not be empty')
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: {
            fullName: fullName,
            email: email
        }},
        {new: true}
    )

    return res
    .status(200)
    .json( new ApiResponse(200, user, 'user details been changed successfully 🫡sir' ))

} );

// upload files - avatar
const updateAvatar = asyncHandler( async (req, res)=>{

    // get files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    // upload in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, 'avatar is required')
    }

    // update is DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {avatar: avatar.url}},
        {new: true}
    )

    // return response
    return res
    .status(200)
    .json( new ApiResponse( 200,{avatar: avatar.url}, 'avatar updated successfully 🫡sir'))
} );

// upload files - coverImage
const updateCoverImage = asyncHandler( async (req, res)=>{

    // get files local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    // upload in cloud
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(400, 'coverImage is required')
    }

    // update is DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {coverImage: coverImage.url}},
        {new: true}
    )

    // return response
    return res
    .status(200)
    .json( new ApiResponse( 200,{coverImage: coverImage.url}, 'coverImage updated successfully 🫡sir'))
} );



export{
    userRegister,
    userLogin,
    userLogout,
    getCurrentUser,
    changePassword,
    refreshedAccessToken,
    changeAccountDetails,
    updateAvatar,
    updateCoverImage
}