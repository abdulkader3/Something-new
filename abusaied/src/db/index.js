import mongoose from "mongoose";
import DB_NAME from "../constances.js";

const ConnectDB = async ()=>{
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Server connected 🌸 host ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log('MongoDB connection failed 😫' , error);
        process.exit(1)
    }
}

export default ConnectDB;