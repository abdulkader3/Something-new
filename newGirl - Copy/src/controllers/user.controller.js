import  jwt    from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
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
        throw new ApiErrors(500, error?.message, 'Something went wrong while generating access token and refreshed token 😑sorry about that sir')
    }
};

// user register
const userRegister = asyncHandlers( async (req,res)=>{

    // get user data from front-end
    const {userName,fullName,email,password} = req.body;

    //Validation
    if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
        throw new ApiErrors(400, 'All filed are required.')
    }


    // Existed user
    const existedUser = await User.findOne({
        $or: [{email}, {userName}]
    })
    if(existedUser){
        throw new ApiErrors(400, 'User with email or username already exist')
    }


    // check Image local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
  if(!avatarLocalPath){
        throw new ApiErrors(400, 'avatar is required')
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
  

    // Upload Image files in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiErrors(400, 'avatar is required')
    }

    // create user Object -entry in db
    const user = await User.create(
        {
            userName: userName.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ''
        }
    )

    // remove password and refresh token from response
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check user creation
    if(!userCreated){
        throw new ApiErrors(500, 'Something went wrong while registering user')
    }

    // Return response
    return res.status(201).json(
        new ApiResponse(200, userCreated, 'User registered successfully 😊')
    )
} )


// user login
const userLogin = asyncHandlers( async (req, res)=>{

    // get login data
    const {userName, email, password} = req.body;

    // email or username
    if(!userName && !email){
        throw new ApiErrors(400, 'username or email is required ')
    }

    // find the user 
    const user = await User.findOne({
        $or: [{userName},{email}]
    })
    if(!user){
        throw new ApiErrors(404, 'user not found')
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiErrors(400, 'incorrect password')
    }

    // generate token
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    // get user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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
    .json( new ApiResponse(200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "user logged in successfully 🫡sir"
    ) )

} );

// user logout
const userLogout = asyncHandlers( async (req, res)=>{

    // create middleware auth - route

    // update refresh token - new
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {
            refreshToken: undefined
        } },
        { new: true }
    )

    // options
    const options = {
        httpOnly: true,
        secure  : true
    }


    // clear cookies
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json( new ApiResponse( 200, {} , "user logged out 🫡sir"))

} );


// end point for refreshing the access token
const refreshedAccessToken = asyncHandlers( async (req, res)=>{

    // get token
    const incomingToken = req.cookies?.refreshToken || req.header("Authorization")?.replace('Bearer ','');
    
    if(!incomingToken){
        throw new ApiErrors(401, 'unauthorized request')
    }

    try {
        
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            throw new ApiErrors(401, 'token expired')
        }

        // final validation
        if(incomingToken !== user.refreshToken){
            throw new ApiErrors(401, 'token expired')
        }

        // renew token 
        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

        // option
        const options ={
            httpOnly: true,
            secure  : true
        }

        // set cookies and res

        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json( new ApiResponse(
            200,
            {accessToken, NewRefreshToken: refreshToken},
            "token been refreshed 🫡sir"
        ) )


    } catch (error) {
        throw new ApiErrors(401, error?.message || 'invalid refreshToken')
    }


} );

// get current user
const currentUser = asyncHandlers( async (req, res)=>{

    // Inject middleware auth - routes

    return res
    .status(200)
    .json( new ApiResponse(200 , req.user, "user data send 🫡sir"))
} );


// change current user password
const changePassword = asyncHandlers( async (req, res)=>{

    // ger old password and new password
    const {oldPassword, newPassword} = req.body;

    if([oldPassword,newPassword].some((e)=> e.trim() === '')){
        throw new ApiErrors(400, 'old and new both password are required')
    }
    
    // get user 
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiErrors(401, 'user not logged in')
    }

    // check old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiErrors(401, 'incorrect old password')
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed 🫡sir"))


} );



// change current user account details
const changeAccountDetails = asyncHandlers( async (req, res)=>{

    // get the details user want to change
    const {fullName, email} = req.body;
    if(!fullName || !email){
        throw new ApiErrors(400, 'Both field are required')
    }

    const existedUser = await User.findOne({email});

    if (existedUser && existedUser._id.toString() !== req.user._id.toString()) {
        throw new ApiErrors(400, 'Email is already used by another account');
    }
    

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: {fullName, email} },{ new: true }
    )

    return res
    .status(200)
    .json( new ApiResponse(200, user, 'details changed 🫡sir'))


} );


// change avatar
const changeAvatar = asyncHandlers( async (req, res)=>{

    
    // get files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiErrors(400, 'avatar is required')
    }

    // upload in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    

    // entry in DB
    await User.findByIdAndUpdate(
        req.user._id,
        {$set:{avatar:avatar.url}},{new:true}
    )

    // return response
    return res
    .status(200)
    .json(new ApiResponse(200, avatar.url, 'avatar changed 🫡sir'))
} );


// change coverImage
const changeCoverImage = asyncHandlers( async (req, res)=>{

    // get files local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiErrors(400, 'coverImage is required')
    }

    // upload in cloud
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiErrors(400, 'coverImage is required')
    }

    // entry in DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {coverImage: coverImage.url}},{ new: true}
    )

    // return response
    return res
    .status(200)
    .json(new ApiResponse(200, coverImage.url, 'coverImage changed 🫡sir'))
} );


// get user channel data
const userChannelProfile = asyncHandlers( async (req, res)=>{

    // get username from params (url)
    const {userName} = req.params;
    if(!userName){
        throw new ApiErrors(400, 'username is missing')
    }

    // mongoDB aggregate pipeline
    const channel = await User.aggregate(
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
                    as: 'userSubscriber'
                }
            },
            {
                $lookup: 
                {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'subscriber',
                    as: 'UserSubscribeTo'
                }
            },
            {
                $addFields: 
                {
                    UserSubCount: {$size: '$userSubscriber'},
                    UserSubToCount : {$size: '$UserSubscribeTo'},

                    isSubscribed: { $in: [req.user._id, "$userSubscriber.subscriber"],
                        than: true,
                        else: false
                    }
                }
            }
        ]
    )

    if(!channel.length){
        throw new ApiErrors(400, 'channel not exist')
    }

    return res
    .status(200)
    .json( new ApiResponse( 200, channel[0], 'channel data send'))


} );





export{
    userRegister,
    userLogin,
    userLogout,
    refreshedAccessToken,
    currentUser,
    changePassword,
    changeAccountDetails,
    changeAvatar,
    changeCoverImage,
    userChannelProfile
}