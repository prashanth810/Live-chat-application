import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";

const Authmiddleware = async (req, res, next) => {
    try {
        // Check for token in cookies first
        let token = req.cookies.token;

        // If not in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "No token Provided !!!" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(400).json({ success: false, message: "Invalid token !!!" });
        }

        const user = await UserModel.findById(decode.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found !!!" });
        }

        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default Authmiddleware;