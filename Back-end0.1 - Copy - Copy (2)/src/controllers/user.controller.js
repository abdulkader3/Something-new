import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";

const userRegister = asyncHandlers( async (req,res)=>{

    // get user data from front-end
    const {userName,fullName,email,password} = req.body;

    //Validation
    if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
        throw new ApiErrors(400, 'All filed are required.')
    }


    // Email validation
  
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    // if(emailRegex.test(email)){
    //     throw new ApiErrors(400, 'Invalid email format.')
    // }


    // Existed use ?
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
export{userRegister}