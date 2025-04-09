import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";



const userRegister = asyncHandlers(async (req, res) => {
  // Get user data from front end 
  const {userName, fullName, email, password} = req.body;

  //validation
  if([userName,fullName,email,password].some((filed)=> filed.trim() === '')){
    throw new ApiErrors(400, 'all filed are required')
  }

  //email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
  if(!emailRegex.test(email)){
    throw new ApiErrors(400, 'Invalid email format')
  }

  // Check user if already exist 
  const existedUser = await User.findOne({
    $or: [{userName}, {email}]
  })
  if(existedUser){
    throw new ApiErrors(400, 'user with username or email already exist ')
  }

  // Image file path
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.avatar[0]?.path;
  if(!avatarLocalPath){
    throw new ApiErrors(400, 'avatar is required ')
  }

  // upload Image files in cloudinary
  const avatar = await UploadOnCloudinary(avatarLocalPath);
  const coverImage = await UploadOnCloudinary(coverImageLocalPath);
  if(!avatar){
    throw new ApiErrors(400, 'avatar is required')
  }

  // create user Object - entry in DB
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

  // Remove password and refresh token from response
  const userCreated = User.findById(user._id).select(
    "-password -refreshToken"
  )

  // Check for user creation 
  if(!userCreated){
    throw new ApiErrors(500, 'something went wrong while registering user')
  }

  // return response
  return res.status(201).json(
    new ApiResponse(200, userCreated, 'user created successfully')
  )


});
export { userRegister };
