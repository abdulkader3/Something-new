import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
   const uploadOnCloudinary = async function (localPath) {
    try {
        if(!localPath) return null

        // upload the file on cloudinary
        cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        //successfully done
        console.log('upload done', response.url)
    } catch (error) {
        fs.unlinkSync(localPath) //deleted
        return null;
        
    }
   }

   export{uploadOnCloudinary}