import mongoose from "mongoose";
import { DB_Name } from "../constences.js";


const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`server connected 🌸 the host is ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection error', error);
        process.exit(1);
        
    }
}

export{connectDB}