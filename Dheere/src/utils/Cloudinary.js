import { configDotenv } from "dotenv";
configDotenv()
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    // upload on cloudinary

    const UploadOnCloudinary = async (fileLocalPath)=>{
        try {
            // if there is no file
            if(!fileLocalPath) return null;

            // upload
            const response = await cloudinary.uploader.upload(fileLocalPath,
                {resource_type: "auto"}
            )

            // after upload file delete
            fs.unlinkSync(fileLocalPath);

            return response;

        } catch (error) {
            // if an error hit delete the file
            fs.unlinkSync(fileLocalPath);

            return null;
            
        }
    };
    export{UploadOnCloudinary};