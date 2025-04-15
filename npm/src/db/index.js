import mongoose from "mongoose";
import { DB_NAME } from "../constance.js";


const connectDB = async ()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGOdb_UIR}/${DB_NAME}`);
        console.log(`server connected🌸 the host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('mongoDB connection error', error);
        process.exit(1);
    }
}

export{connectDB};