import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { app } from './app.js';
dotenv.config('./env')
connectDB()



.then(()=>{

    const PORT = (process.env.PORT || 900)
    app.listen(PORT, ()=>{
        console.log(`app is listening on port ${PORT}`)
    })
})
.catch((err)=>{
    console.log('mongoDB connection error', err)
})