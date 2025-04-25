import { configDotenv } from "dotenv";
configDotenv();
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    // upload on cloudinary
    const UploadOnCloudinary = async (localFilePath)=>{
        try {
            // if no local files
            if(!localFilePath) return null;

            // upload
            const response = await cloudinary.uploader.upload(localFilePath,
                {resource_type: 'auto'}
            )

            // after upload 
            fs.unlinkSync(localFilePath) // delete

            // return response
            return response;


        } catch (error) {
            // if error hit
            fs.unlinkSync(localFilePath) // delete

            return null;
        }
    };
    export{UploadOnCloudinary};
    
   