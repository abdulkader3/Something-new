import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:   process.env.CLOUDINARY_API_SECRET
    }); 


    const uploadOnCloudinary = async (localFilePath)=>{
        try {
            cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            })

            console.log("uploaded successfully",response.url)
        } catch (error) {
            fs.unlinkSync(localFilePath) //delete
            return null
        }
    }
    export{uploadOnCloudinary}