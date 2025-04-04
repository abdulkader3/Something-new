import mongoose from "mongoose";
import DB_NAME from "../constances.js";


const connectDB = async ()=>{
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`you got it bro 😊👉🌸 DataBase is connected the host ${connectionInstance.connection.host}`)
        
    } catch (error) {

        console.log('mongoDB connection field 😫👈' , error);
        process.exit(1);
        
    }
}

export default connectDB;