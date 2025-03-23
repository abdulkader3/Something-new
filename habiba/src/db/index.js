import mongoose from "mongoose";
import DB_NAME from "../constances.js";

const connecteDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(` MongoDB connected 🌸 host👉${connectionInstance}`)
        
    } catch (error) {

        console.log('connection error 😫👉' , error );
        process.exit(1)

        
    }
}

export default connecteDB;