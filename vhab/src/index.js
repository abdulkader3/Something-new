import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config('./env')

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`app listening on port ${process.env.PORT}`)
    })
})

.catch((err)=>{
    console.log('Mongodb connection error' , err)
})