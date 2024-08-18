import express from "express";
// import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import cookieParser from "cookie-parser";
import cors from 'cors' 
import {v2 as cloudinary} from "cloudinary";
import messageRoutes from './routes/messageRoutes.js'
import { app, server } from "./socket/socket.js";



dotenv.config();
connectDB();


const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

// Middlewares => The funcs that run between req and res
app.use(cors({
  origin: 'https://threads-clone-mern-frontend.vercel.app',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Adjust limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Adjust limit as needed
app.use(cookieParser()); //Allow us to get the cookie from req and set the cookie from res


// Routes

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)


server.listen(PORT, ()=>console.log(`Server started at http://localhost:${PORT}`))
