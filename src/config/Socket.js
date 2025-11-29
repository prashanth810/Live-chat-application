import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import Envs from '../envs/Envs.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: Envs.FRONT_END || "https://livechatfrontend.onrender.com", // your React frontend
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("message", (msg) => {
        io.emit("recieve-message", msg);
    });


    // socket.emit("wellcome", "well come to srever !!!", `${socket.id}`);
    // socket.broadcast.emit("wellcome", `${socket.id} joind to server !!!`);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

export { app, server };
