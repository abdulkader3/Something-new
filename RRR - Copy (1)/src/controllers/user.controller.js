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


// change current password
const changeCurrentPassword = asyncHandler( async (req, res)=>{

    // get user data like old pass and new password they want
    const {oldPassword , newPassword} = req.body;
    if([oldPassword,newPassword].some((fields)=> fields.trim() === '')){
        throw new ApiError(401, 'both fields are required')
    }

    // get user 
    const user = await User.findById(req.user?._id);

    // check old password is correct ?
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400, 'incorrect password')
    }


    // what ?
    user.password = newPassword;
    // new update the new password
    await user.save({validateBeforeSave: false});  


    // return response
    return res
    .status(200)
    .json( new ApiResponse(200, {},"Password hes been changed 🫡sir."))

} );

// get current user
const getCurrentUser = asyncHandler( async (req, res)=>{
    // inject middleware verifyJWT 

    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User data fetched successfully 🫡sir"))
} );

// update account details
const updateAccountDetails = asyncHandler( async (req, res)=>{

    // get data user want to change
    const {fullName, email} = req.body;

    // make sure fields are not empty
    if(!fullName || !email){
        throw new ApiError(400, 'fields can not be empty')
    }

    // update the data
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName: fullName,
                email   : email
            }
        },
        {new: true}
    ).select("-password")

    // return response
    return res
    .status(200)
    .json(new ApiResponse(200, user, "user details updated successfully 🫡sir" ))



} );

// upload files -avatar
const updateAvatarFile = asyncHandler( async (req, res)=>{

    // get file local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }

    // now upload file on cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(500, 'something went when avatar was uploading.. ')
    }

    // new update in -DB
    await User.findByIdAndUpdate(
        req.user._d,
        {$set: {avatar: avatar?.url || "avatar update was incomplete"}}
    ).select("-password")

    // return response avatar.url
    return res
    .status(200)
    .json(new ApiResponse(200, avatar?.url || 'avatar update was incomplete', 'avatar update was successful🫡sir'))
} );

// upload files -coverImage
const updateCoverImageFile = asyncHandler( async (req, res)=>{

    // get file local path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, 'coverImage is required')
    }

    // upload file in cloud 
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(400, 'coverImage is required')
    }

    // update coverImage in -DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {coverImage: coverImage?.url || "coverImage was incomplete"}},{ new: true}
    ).select("-password")

    // return response and coverImage.url
    return res
    .status(200)
    .json( new ApiResponse(200, coverImage?.url || 'coverImage was incomplete' , 'coverImage was complete 🫡sir'))
} );



export{
    userRegister,
    userLogin,
    userLogout,
    refreshedAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatarFile,
    updateCoverImageFile
};