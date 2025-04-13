import dotenv from 'dotenv';
dotenv.config('./.env')
import { connectDB } from './db/index.js';
import { app } from './app.js';

connectDB()

.then(()=>{
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, ()=>{
        console.log(`app is listening on port ${PORT}`)
    })
})

.catch((error)=>{
    console.log('mongoDB connection error', error)
})