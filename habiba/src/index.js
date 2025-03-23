import dotenv from 'dotenv';
import connecteDB from './db/index.js';
dotenv.config('./env')
connecteDB()