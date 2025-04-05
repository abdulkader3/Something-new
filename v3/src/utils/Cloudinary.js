import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
   

    const UploadOnCloudinary = async (localFilePath)=>{
        try {

            //upload
            cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            
            //success
            console.log("Upload success", response.url)
            
        } catch (error) {

            fs.unlinkSync(localFilePath) //delete

            return null
            
        }
    }
    export{UploadOnCloudinary}