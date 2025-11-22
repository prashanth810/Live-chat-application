import { Server } from "socket.io";
import http from "http";
import express from "express";
import Envs from "../envs/Envs.js";
import { SocketMiddleware } from "../middleawares/SocketMiddleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [Envs.FRONT_END],
        credentials: true,
    },
});

io.use(SocketMiddleware);

const usersocketmap = {};

io.on("connection", (socket) => {
    console.log(`${socket.user.fullName} connected`);

    usersocketmap[socket.userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(usersocketmap));

    socket.on("disconnect", () => {
        console.log(`${socket.user.fullName} disconnected`);
        delete usersocketmap[socket.userId];
        io.emit("getOnlineUsers", Object.keys(usersocketmap));
    });
});


export { io, app, server };
