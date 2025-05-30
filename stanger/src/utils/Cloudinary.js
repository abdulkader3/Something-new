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


// upload on cloud
const UploadOnCloudinary = async (localFilePath)=>{
    try {
        
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,
            {resource_type: 'auto'}
        )

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // delete

        return null;
    }
};

export{UploadOnCloudinary};


