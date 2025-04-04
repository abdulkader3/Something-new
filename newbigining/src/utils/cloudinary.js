import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });





    const uploadOnCloudinary = async function (localFilePath) {
        try {
            if(!localFilePath) return null

            //upload file on cloudinary 
            cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            })

            //Some extra work for ease of mind 
            console.log('file uploaded successfully' , response.url);
        } catch (error) {

            fs.unlinkSync(localFilePath) //This line of code will remove the temporary file that's been store in our local server
            return null; 
            
        }
    }



export{uploadOnCloudinary}