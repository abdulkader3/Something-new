import mongoose from "mongoose";
import DB_NAME from "../constants.js";


const connectDB = async ()=>{
    try {

        const connectionInstace = await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`);
        console.log(`mongoDB connect 🌸 😊 👉  ${connectionInstace.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDB connect er error 😫👉` , error);
        process.exit(1)
        
    }
}

export default connectDB;