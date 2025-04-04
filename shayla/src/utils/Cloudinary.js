import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    
    const UploadOnCloudinary = async (LocalFilePath)=>{

       try {
        cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto"
        })

        //s
        console.log('up success', response.url)
       } catch (error) {
        
        //delete
        fs.unlinkSync(LocalFilePath)

        return null
       }
    }
    export{UploadOnCloudinary}