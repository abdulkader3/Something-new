import express from 'express';
import { DB_NAME } from '../constances.js';
import mongoose from 'mongoose';


const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Your Connected to MongoDB saver 🌸 The Host 👉 ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection Error' , error);
        process.exit(1)
        
    }
}

export{connectDB}