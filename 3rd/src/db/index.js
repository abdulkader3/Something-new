import mongoose from "mongoose";
import DB_NAME from "../constants.js";


const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected 🌸 The Host ${connectionInstance.connection.host}`)
        //console.log(`\n MongoDB connected 🌸 The Host ${connectionInstance.connection.host}`)

        
    } catch (error) {
        console.log('mongoDB connect error ');
        process.exit(1);
        
    }
}

export default connectDB;