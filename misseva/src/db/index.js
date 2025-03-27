import mongoose from "mongoose";
import { DB_NAME } from "../constance.js";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`you connected 🌸 the host 👉 ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection Error',error);
        process.exit(1)
    }
}

export {connectDB}