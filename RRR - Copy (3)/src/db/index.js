import mongoose from "mongoose";
import { DB_name } from "../constance.js";


const connectDB = async ()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
        console.log(`server connected 🌸😊👍 the host ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log('mongoDB connection error', error);
        process.exit(1);
    }
};
export{connectDB};