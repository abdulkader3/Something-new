import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    

    // upload on cloud
    const UploadOnCloudinary = async (LocalFilePath)=>{
        try {
            if(!LocalFilePath) return null;

            //Upload
            const response = await cloudinary.uploader.upload(LocalFilePath,
                {
                    resource_type: "auto"
                }
            )

            //success
            console.log('Upload success', response.url)

            return response;
        } catch (error) {
            fs.unlinkSync(LocalFilePath) // delete

            return null;
            
        }
    }
    export{UploadOnCloudinary}