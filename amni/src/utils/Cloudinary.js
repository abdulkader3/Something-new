import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    

    // upload on cloudinary
    const UploadOnCloudinary = async (fileLocalPath)=>{
        try {
            if(!fileLocalPath) return null;

            const response = await cloudinary.uploader.upload(fileLocalPath, {
                resource_type: "auto"
            })

            //success
            console.log('file upload success', response.url)

            return response;

        } catch (error) {
            fs.unlinkSync(fileLocalPath) //delete

            return null;
            
        }
    }
    export{UploadOnCloudinary}