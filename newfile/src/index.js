import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
dotenv.config('./env')
connectDB()

.then(()=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})
.catch((ERR)=>{
    console.log('mongoDB connection Error', ERR)
})