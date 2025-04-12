import { User } from "../models/user.model.js";
import {
    ApiErrors
} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    asyncHandlers
} from "../utils/asyncHandlers.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import path from 'path';

const userRegister = asyncHandlers(async (req, res) => {

    //get user data from front-end
    const {userName,fullName,email,password} = req.body;
    console.log(userName, fullName, email, password)

    //Validation
    if ([userName, fullName, email, password].some((filed) => filed.trim() === '')) {
        throw new ApiErrors(400, 'all filed are required')
    }


    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiErrors(400, 'Invalid email format')
    }

    //check existed user
    const existedUser = await User.findOne({
        $or: [{email}, {userName}]
    })
    if(existedUser){
        throw new ApiErrors(400, "user with email or username already exist")
    }


    //Image local path
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;


    const avatarLocalPath = path.resolve(req.files?.avatar?.[0]?.path);
const coverImageLocalPath = path.resolve(req.files?.coverImage?.[0]?.path);
    if(!avatarLocalPath){
        throw new ApiErrors(400, 'avatar is required')
    }


    //upload Image file in cloudinary
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiErrors(400, 'avatar is required')
    }
    console.log("✅ Upload complete, sending response...");


    //create user Object -entry in DB
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })


    //remove password and refresh token from response
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check user creation
    if(!userCreated){
        throw new ApiErrors(500, 'something went wrong while registering user')
    }

    //return response
    return res.status(201).json(
        new ApiResponse(200, userCreated, 'user registered successfully')
    )
    console.log("✅ Upload complete, sending response...");
})
export {
    userRegister
}