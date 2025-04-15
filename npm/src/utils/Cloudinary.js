import { configDotenv } from "dotenv";
configDotenv()
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    //upload
    const UploadOnCloudinary = async (localFilePath)=>{
        try {
            // if empty
            if(!localFilePath) return null;

            //Upload
            const response = await cloudinary.uploader.upload(
                localFilePath,
                {resource_type: "auto"}
            )

            fs.unlinkSync(localFilePath) // delete

            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) // delete

            return null;
        }
    }
    export{UploadOnCloudinary}
    
    