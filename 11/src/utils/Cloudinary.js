import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// ✅ Log your Cloudinary ENV vars (for debug only – remove in production)
console.log("🌩️ Cloudinary ENV Config:");
console.log("Cloud name:", process.env.CLOUDINARY_API_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY);
console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "✅ exists" : "❌ missing");

// ✅ Actual Configuration (DON’T replace secret with emojis here!)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Upload Function with Detailed Debugging
const UploadOnCloudinary = async (LocalFilePath) => {
    try {
        if (!LocalFilePath) {
            console.log("⚠️ No file path provided");
            return null;
        }

        // ✅ Check if file exists before attempting upload
        if (!fs.existsSync(LocalFilePath)) {
            console.log("❌ File does not exist at path:", LocalFilePath);
            return null;
        }

        console.log("📁 Uploading file from:", LocalFilePath);

        // ✅ Upload to Cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto"
        });

        // ✅ Upload success
        console.log("✅ Upload success:", response.url);

        // ✅ Optionally delete the local file after upload
        

        return response;

    } catch (error) {
        console.error("❌ Error during upload:", error.message);
        console.error(error); // full stack trace

        // ❗ Clean up the file in case of error
        try {
            fs.unlinkSync(LocalFilePath);
            console.log("🗑️ Local file deleted due to upload failure");
        } catch (unlinkError) {
            console.error("❌ Failed to delete file:", unlinkError.message);
        }

        return null;
    }
};

export { UploadOnCloudinary };
