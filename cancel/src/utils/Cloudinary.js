import dotenv from 'dotenv';
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key:    process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    // Upload
    const UploadOnCloudinary = async (localFilePath)=>{
        try {
            // If local path is Empty
            if(!localFilePath) return null;

            //Upload
            const response = await cloudinary.uploader.upload(
                localFilePath,
                {resource_type: "auto"}
            )

            //success
            fs.unlinkSync(localFilePath);
            
            return response;
            
        } catch (error) {
            
            fs.unlinkSync(localFilePath); //delete

            return null;
        }
    }

    export{UploadOnCloudinary}