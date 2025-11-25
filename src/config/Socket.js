import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // your React frontend
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("user connected !!!", socket.id);
});

io.on("disconnected", (socket) => {
    console.log("user disconnected !!!");
})

export { app, server };
