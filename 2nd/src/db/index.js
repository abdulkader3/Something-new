import mongoose from "mongoose";
import Db_NAME from '../constants.js';


const connectDB = async ()=>{
    try {

        const connectionInstance = 
               await mongoose.connect(
                `${process.env.MONGODB_URI}/${Db_NAME}`
               )
               console.log(`connect hoise🌸 !! DB Host ${connectionInstance}`)
        
    } catch (error) {
        console.log(
            " mongoose connect hoyni😫 f:db.index.js 👈 " , error
        );
         process.exit(1)
        
    }
}

export default connectDB;