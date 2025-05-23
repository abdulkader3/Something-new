import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });



    const uploadFileOnCloudinary = async (localPath)=>{
        try {
            if(!localPath) return null

            cloudinary.uploader.upload(localPath, {
                resource_type: 'auto'
            })

            console.log( 'upload success', response.url)
        } catch (error) {
            fs.unlinkSync(localPath) //delete

            return null;
            
        }
    }

    export{uploadFileOnCloudinary}