import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";

const userRegister = asyncHandlers( async (req,res)=>{
    // get user data from from-end
    const {userName,fullName,email,password} = req.body;
    
    //Validation
    if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
        throw new ApiErrors(400, 'all filed are required')
    }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    if(!emailRegex.test(email)){
        throw new ApiErrors(400, 'Invalid email format')
    }

    //check user already exist
    const existedUser = await User.findOne({
        $or: [{email},{userName}]
    })
    if(existedUser){
        throw new ApiErrors(400, 'user with email or username already exist')
    }

    // check for Image files
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiErrors(400, 'avatar is required')
    }

    // upload Image in cloud
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiErrors(400, 'avatar is required')
    }

    // create user Object - entry in DB
    const user = User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })

    // remove password and refresh token from response
    const userCreated = User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check user creation
    if(!userCreated){
        throw new ApiErrors(500, 'something went wrong while registering user')
    }

    // return response
    return res.status(201).json(
        new apiResponse(200, userCreated, 'user registered successfully ')
    )
})
export{userRegister}