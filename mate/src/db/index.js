import mongoose from "mongoose";
import { DB_NAME } from "../constances.js";


const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Your Connected to MongoDB Sever 🌸 The Host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection error' , error);
        process.exit(1);
        
    }
}

export{connectDB}