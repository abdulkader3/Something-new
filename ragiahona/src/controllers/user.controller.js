import { User, User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


const userRegister = asyncHandlers(async (req, res) => {


  // get user details from front end
  // validation - shouldn't be empty
  // Check if user already exist: username, email
  // Check for image - check for avatar
  // Upload them in Cloudinary - Avatar
  // Create user object - create entry in Db
  // remove password and refresh token field from response
  // Check for user creation 
  // Return res




  

  //Get user details from front end 
  const {fullName, userName, email, password} = req.body
  console.log('email: ', email ,  'password', password , userName);





  //Validation -no empty
  if( [fullName, userName, email, password].some((field)=> field?.trim() === '') ){
    throw new ApiErrors(400, 'all field are required')
  }





//  Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)){
    throw new ApiErrors(400, 'invalid email format')
  }




  //Check if user already exists -Email and username
  const existedUser = User.findOne({
    $or: [{userName},{email}]
  })

  if(existedUser){
    throw new ApiErrors(409, 'user with email or username already exits')
  }



 // check for images -avatar and cover image 
  const AvatarLocalFilePath = req.files?.avatar[0]?.path;
  const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

  if(!AvatarLocalFilePath){
    throw new ApiErrors(400, 'avatar is required')
  }






// Upload image -avatar and Cover image into Cloudinary

const avatar = await UploadOnCloudinary(AvatarLocalFilePath);
const coverImage = await UploadOnCloudinary(coverImageLocalFilePath);

if(!avatar){
  throw new ApiErrors(400, 'avatar is required')
}




// Create user object -create entry in DB
const User = await User.create(
  {
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    userName: userName.toLowerCase()
  }
)




// remove password and refresh token field from response

const createUser = await User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createUser){
  throw new ApiErrors(500, 'something went wrong when creating user account')
}

// Check for user creation
return res.status(201).json(
  new ApiResponse(200, createUser, "User been registered successfully")
)




});
export { userRegister };
