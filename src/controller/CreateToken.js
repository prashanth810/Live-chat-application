import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const CreateToken = (id, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return res.status(400).json({ success: false, message: "Jwt secret is no configured !!!" });
    }
    const token = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "developement" ? false : true,
    });
    return token;
}

export default CreateToken;