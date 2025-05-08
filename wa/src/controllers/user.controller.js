import  jwt    from  "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import e from "express";

// token generator
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500, 'something went wrong while generating access token and refresh token')
    }
};

// user Register
const userRegister = asyncHandler( async (req, res)=>{
    
    // get user data from frontend
    const {userName, fullName, email, password} = req.body;

    // Validation
    if([userName, fullName, email, password].some((e)=> e.trim() === '')){
        throw new ApiError(400, 'all fields are required')
    }

    // check existed user
    const existedUser = await User.findOne({
        $or: [{userName},{email}]
    })
    if(existedUser){
        throw new ApiError(400, 'username or email already exist')
    }

    // get local files path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // upload files in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400, 'avatar is required to uploaded')
    }

    // crate user object -entry in DB
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName: fullName,
        email: email,
        password: password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })


    // remove refresh token and password
    const userCreated = await User.findById(user._id).select("-password -refreshToken")


    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user')
    }

    // return response
    return res
    .status(201)
    .json( new ApiResponse(200, userCreated, 'user created 🫡sir'))




} );

// user login 
const userLogin = asyncHandler( async (req, res)=>{

    // get user login data
    const {userName, email, password} = req.body;

    if(!userName && !email){
        throw new ApiError(400, 'username or email is required')
    }

    // find the user
    const user = await User.findOne({
        $or: [{userName},{email}]
    })
    if(!user){
        throw new ApiError(404, 'user not found ')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, 'incorrect password')
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);


    // get user 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


    // options
    const options = {
        httpOnly: true,
        secure  : true
    }


    // send cookies
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json( new ApiResponse( 200, {user: loggedInUser, accessToken, refreshToken}, 'user logged in 🫡sir'))

} );

// user logout
const userLogout = asyncHandler( async (req, res)=>{

    // create middleware auth - routes


    // update refreshToken -new
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
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json( new ApiResponse( 200, {}, "user logged out 🫡sir "))


} );


// end point for token renew
const TokenRenew = asyncHandler( async (req, res)=>{
    
const incomingToken = req.cookies?.refreshToken || req.header("Authentication")?.replace("Bearer ","");
        if(!incomingToken){
            throw new ApiError(401, 'Unauthorized request')
        }
    
try {
    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password");
        
        if(!user){
            throw new ApiError(401, 'Refresh token expire')
        }

    if(incomingToken !== user?.refreshToken){
        throw new ApiError(401, 'Unauthorized or expired token')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user?._id);

    const options = {
        httpOnly : true,
        secure   : true
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken , options)
    .cookie('refreshToken', refreshToken, options)
    .json( new ApiResponse(200, {accessToken, refreshToken}))

    } catch (error) {
        throw new ApiError(401, error?.message || 'Could not renew the token ')
    }


} );


// get current user data
const userData = asyncHandler( async (req, res)=>{

    // Inject auth middleware
    return res
    .status(200)
    .json( new ApiResponse(200, req.user, 'current user data send 🫡sir ')) 
} );



// change current user password
const changePassword = asyncHandler( async (req, res)=>{

    // get old password and new password
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400, 'old and new both password are required')
    }

    // get user
    const user = await User.findById(req.user._id);

    // check old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400, 'old password is incorrect')
    }

    // save new password
    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json( new ApiResponse(200,{}, 'password changed 🫡sir '))



} );


// change account details
const changeAccountDetails = asyncHandler( async (req, res)=>{

    // get data user want to change
    const {fullName, email} = req.body;

    if( !fullName || !email){
        throw new ApiError(400, 'fullname and email both are required')
    }

    // updata details
    const userData = await User.findByIdAndUpdate(
        req.user._id,
        { $set: {fullName: fullName, email: email}},{new: true}
    )


    return res
    .status(200)
    .json( new ApiResponse(200, userData, 'user data changed 🫡sir'))

} );


// change avatar
const changeAvatar = asyncHandler( async (req, res)=>{

    // get user avatar file local path
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    // upload in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400, 'avatar is required')
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {avatar: avatar.url}},{new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, avatar.url, 'avatar changed 🫡sir'))


} );

// change coverImage
const changeCoverImage = asyncHandler( async (req, res)=>{

    // get user avatar file local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, 'coverImage is required')
    }

    // upload in cloud
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);

    if(!coverImage){
        throw new ApiError(400, 'coverImage is required')
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {coverImage: coverImage.url}},{new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, coverImage.url, 'coverImage changed 🫡sir'))


} );


// get user Channel profile
const getUserChannelProfile = asyncHandler( async (req, res)=>{

    // get userName from params (link-address)
    const {userName} = req.params;
    if(!userName){
        throw new ApiError(400, 'username is missing')
    }


    // MongoDB aggregate pipeline
    const Channel = await User.aggregate(
        [
            {
                $match: {userName: userName.toLowerCase()}
            },
            {
                $lookup:
                {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'channel',
                    as: 'userSubscribers'
                }
            },
            {
                $lookup:
                {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'subscriber',
                    as: 'userSubscribedTo'
                }
            },
            {
                $addFields: 
                {
                    userSubCount: { $size: '$userSubscribers'},
                    userSubToChannelCount: { $size: '$userSubscribedTo'},

                    isSubscribed: {
                        if: { $in: [req.user?._id, '$userSubscribers.subscriber']},
                        than: true,
                        else: false 
                    }
                }
            },
            {
                $project:
                {
                    userName: 1,
                    fullName: 1,
                    email   : 1,
                    avatar  : 1,
                    coverImage: 1,
                    userSubCount: 1,
                    userSubToChannelCount: 1,
                    isSubscribed: 1
                }
            }
        ]
    )


    if(!Channel?.length){
        throw new ApiError( 404, 'channel not found')
    }

    // send res
    return res
    .status(200)
    .json( new ApiResponse(200, Channel[0], " channel data send 🫡sir "))



} );





export{
    userRegister,
    userLogin,
    userLogout,
    TokenRenew,
    userData,
    changePassword,
    changeAccountDetails,
    changeAvatar,
    changeCoverImage,
    getUserChannelProfile
}