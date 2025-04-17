import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";



// user register
const userRegister = asyncHandler( async (req, res)=>{

    // get user data from frontend
    const {userName,fullName,email,password} = req.body;
    console.log(userName,fullName,email,password);

    // Validation
    if([userName,fullName,email,password].some((fields)=> fields.trim()==='')){
        throw new ApiError(400, 'all fields are required')
    }

    // Email Validation


    // check existed user
    const existedUser = await User.findOne({
        $or: [{email},{userName}]
    })
    if(existedUser){
        throw new ApiError(400, 'user with email or username already exist')
    }

    // Image local Path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path
    };


    // Upload Image in cloud
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

    // remove user password and refresh token from response
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    
    // check user creation
    if(!userCreated){
        throw new ApiError(500, 'something went wrong while registering user')
    }

    // return response

    return res.status(201).json(
        new ApiResponse(200, userCreated, 'user registered successfully 😊👈🌸👉😊')
    )
});


// user Login
const userLogin = asyncHandler( async (req, res)=>{

    // get user login data

    // email and username

    // find user

    // check password

    // access and refresh token

    // send cookies
})





// user logOut



export{
    userRegister,
    userLogin,
};