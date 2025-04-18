import mongoose from "mongoose";
import { DB_name } from "../constances.js";



const connectDB = async ()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`server connected🌸 host ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log('mongoDB connection errors' , error);
        process.exit(1);
    }
}
export{connectDB}