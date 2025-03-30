import mongoose from "mongoose";
import { DB_Name } from "../constances.js";


const connectDB = async ()=>{
    try {
        const connectionInstanc = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`connected to sever 🌸 the host ${connectionInstanc.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection Error ', error);
        process.exit(1)
        
    }
}
export{connectDB}
