import  jwt    from  "jsonwebtoken";
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
        throw new ApiError(500, error?.message, 'Something went wrong while generating access token and refreshed token 😑sorry about that sir')
    }
};

// user register
const userRegister = asyncHandler( async (req, res)=>{

    // get user data
    const {userName, fullName, email, password} = req.body;

    // Validation
    if([userName,fullName,email,password].some((e)=> e.trim() === '')){
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
    let coverImageLocalPath;
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
    const userCreated = await User.findById(user._id).select('-password -refreshToken');

    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'Something went wrong while registering user 😑sorry about that sir')
    }

    // return res
    return res
    .status(201)
    .json( new 
        ApiResponse( 200 , userCreated, 'user registered successfully 🫡sir')
    )


} );


// user login
const userLogin = asyncHandler( async (req, res)=>{

    // get login data
    const {userName, email, password} = req.body;

    // email or username
    if(!userName && !email){
        throw new ApiError(400, 'username or email is required ')
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
        throw new ApiError(400, 'incorrect password')
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
const userLogout = asyncHandler( async (req, res)=>{

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
const refreshedAccessToken = asyncHandler( async (req, res)=>{

    // get token
    const incomingToken = req.cookies?.refreshToken || req.header("Authorization")?.replace('Bearer ','');
    
    if(!incomingToken){
        throw new ApiError(401, 'unauthorized request')
    }

    try {
        
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            throw new ApiError(401, 'token expired')
        }

        // final validation
        if(incomingToken !== user.refreshToken){
            throw new ApiError(401, 'token expired')
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
        throw new ApiError(401, error?.message || 'invalid refreshToken')
    }


} );

// get current user
const currentUser = asyncHandler( async (req, res)=>{

    // Inject middleware auth - routes

    return res
    .status(200)
    .json( new ApiResponse(200 , req.user, "user data send 🫡sir"))
} );


// change current user password
const changePassword = asyncHandler( async (req, res)=>{

    // ger old password and new password
    const {oldPassword, newPassword} = req.body;

    if([oldPassword,newPassword].some((e)=> e.trim() === '')){
        throw new ApiError(400, 'old and new both password are required')
    }
    
    // get user 
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(401, 'user not logged in')
    }

    // check old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(401, 'incorrect old password')
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed 🫡sir"))


} );



// change current user account details
const changeAccountDetails = asyncHandler( async (req, res)=>{

    // get the details user want to change
    const {fullName, email} = req.body;
    if(!fullName || !email){
        throw new ApiError(400, 'Both field are required')
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
const changeAvatar = asyncHandler( async (req, res)=>{

    
    // get files local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
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
const changeCoverImage = asyncHandler( async (req, res)=>{

    // get files local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, 'coverImage is required')
    }

    // upload in cloud
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(400, 'coverImage is required')
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





export{
    userRegister,
    userLogin,
    userLogout,
    refreshedAccessToken,
    currentUser,
    changePassword,
    changeAccountDetails,
    changeAvatar,
    changeCoverImage
}