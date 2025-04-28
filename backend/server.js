import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import authRoutes from './routes/auth.js'

dotenv.config()

const app =  express();
app.use(cors());
app.use(express.json());

const PORT = 5001

app.use('/auth',authRoutes);



let pool;
const connectDB =  async() =>{
    try{
        pool = await mysql.createPool({
        host:"localhost",
        user:"root",
        password:"",
        database:"admin"
    });
    console.log("Mysql connected successfully")
}catch(error){
    console.error("MYSQL pool error",error)
process.exit(1)
}
}

connectDB();

app.listen(PORT,()=>console.log(`Server started on : ${PORT}`))

export {pool}