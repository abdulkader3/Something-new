import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    

    // Upload on Cloudinary
    const UploadOnCloudinary = async (LocalFilePath)=>{
        try {
            // if empty
            if(!LocalFilePath) return null;

            //upload
            const response = await cloudinary.uploader.upload(
                LocalFilePath,
                {resource_type: "auto"}
            )

            //success
            fs.unlinkSync(LocalFilePath) //delete

            // Return
            return response;
        } catch (error) {
            fs.unlinkSync(LocalFilePath) //delete

            //return
            return null;
        }
    }
    export{UploadOnCloudinary}
   