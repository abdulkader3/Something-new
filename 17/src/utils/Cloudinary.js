import dotenv from 'dotenv';
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiErrors } from './ApiErrors.js';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
   

    const UploadOnCloudinary = async (localFilePath)=>{
        try {

            if(!localFilePath) return null;

            //upload
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: 'auto'
            })
            
            
            //success
            console.log("Upload success", response.url)
            fs.unlinkSync(localFilePath);

            return response;
            
        } catch (error) {

            fs.unlinkSync(localFilePath) //delete
            throw new ApiErrors(400, 'in Cloudinary', error)

            return null
            
        }
    }
    export{UploadOnCloudinary}