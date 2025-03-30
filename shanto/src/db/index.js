import mongoose from "mongoose";
import { DB_Name } from "../constence.js";


const ConnectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`mongoDB connected to sever 🌸 the host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection error' , error);
        process.exit(1)
        
    }
}

export{ConnectDB}