import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http"; // used bcoz of socket.io || socket.io supports the http
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
         

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, { cors: { origin: "*" } });                
                            // line 12 first parameter

// Store online users
export const userSocketMap = {}     // key value userId:socketId 

// Soclet.io connection handler
io.on("connection",(socket)=>{ 
    const userId =socket.handshake.query.userId;
    console.log("User connected",userId) 

    if (userId) userSocketMap[userId]=socket.id;
    
    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
        
    })
        
})

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("server is ready"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connecting to db 
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 
