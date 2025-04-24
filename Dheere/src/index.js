import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { app } from './app.js';
dotenv.config('./.env');
connectDB()

.then(()=>{
    const port = process.env.PORT || 9000;
    app.listen(port, ()=>{
        console.log(`server is listening on port ${port}`)
    })
})

.catch((error)=>{
    console.log('mongoDB connection error', error)
})



