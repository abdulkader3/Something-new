import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config('./env')

connectDB()

.then(()=>{
    const PORT = (process.env.PORT || 9000)
    app.listen(PORT , ()=>{
        console.log(`app listening on port ${PORT}`)
    })
})

.catch((err)=>{
    console.log('Mongodb connection error' , err)
})