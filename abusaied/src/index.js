import dotenv from 'dotenv';
import ConnectDB from './db/index.js';
import { app } from './app.js';
dotenv.config('./env')




ConnectDB()

.then(()=>{
    app.listen(process.env.PORT || 7000, ()=>{
        console.log(` 🌸 app is running on port ${process.env.PORT}`)
    })
})

.catch((error)=>{
    console.log('mongoDB connection error',error)
})