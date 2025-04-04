import dotenv from 'dotenv';
import express from 'express';
import { ConnectDB } from './db/index.js';
dotenv.config('./env')
ConnectDB()



.then(()=>{
    const app = express()
    const port = (process.env.PORT || 9000);
    app.listen( port , ()=>{
        console.log(`app is listening on port ${port}`)
    })
})

.catch((error)=>{
    console.log('mongoDB connection error ' , error)
})