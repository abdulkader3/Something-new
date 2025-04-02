import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/index.js';
dotenv.config('./env')
connectDB()

.then(()=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})

.catch((err)=>{
    console.log('mongoDB connection Errors ' , err)
})