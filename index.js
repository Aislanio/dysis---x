import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';

let IDS = 3

const app = express();

dotenv.config()
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static('public'));






app.use('/',authRoutes)
//conexao com o banco de dados
const connectDB = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB mensagens conectado")     
    } catch (error) {
        console.log('ERRO NA CONEXAO', error)
    }
    
}
connectDB()


const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});