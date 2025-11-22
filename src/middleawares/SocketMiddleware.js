import jwt from "jsonwebtoken";
import Envs from "../envs/Envs.js";
import UserModel from "../model/UserModel.js";

export const SocketMiddleware = async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        const token = cookieHeader?.split("; ")
            .find(row => row.startsWith("token="))   // MUST MATCH FRONTEND COOKIE NAME
            ?.split("=")[1];


        if (!token) return next(new Error("Unauthorized — no token"));

        const decode = jwt.verify(token, Envs.APP_PASS.JWT_SECRET);
        const user = await UserModel.findById(decode.id).select("-password");

        if (!user) return next(new Error("User not found"));

        socket.userId = user._id.toString();

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
};
