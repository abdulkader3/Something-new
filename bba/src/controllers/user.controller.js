import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const userRegister = asyncHandlers(async (req, res) => {
    // Get user data from front end 
    const {userName,fullName,email,password} = req.body;

    //Validation
    if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
        throw new ApiErrors(400, 'all filed are required')
    }

    // email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new ApiErrors(400, 'Invalid email format')
    }

    // Check if there any existing user
    const existingUser = User.findOne({
        $or: [{userName},{email}]
    })
    if(existingUser){
        throw new ApiErrors(400, 'user already exist with email or username')
    }

    // Check for images files
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiErrors(400, 'avatar is required')
    }

    // upload image files in Cloudinary
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    const coverImage = await UploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiErrors(400, 'avatar is required')
    }

    // Create user object -create entry in DB
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })



    // Remove password and refresh token field from response
    const UserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //Check user creation 
    if(!UserCreated){
        throw new ApiErrors(500, 'Something went wrong while registering the user')
    }

    // Return response 
    return res.status(201).json(
        new ApiResponse(200, UserCreated, 'The user been registered successfully')
    )


});
export { userRegister };
