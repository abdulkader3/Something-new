// require('dotenv').config({path:"./env"})
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config('./env')





connectDB()
