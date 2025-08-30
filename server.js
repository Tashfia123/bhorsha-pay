import express from 'express'

import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/admin", adminRoutes); // Add admin routes
app.use("/api/v1/payments", paymentRoutes); // Add payment routes


app.get('/', (req,res)=>{
    res.send("<h1>Welcome</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});