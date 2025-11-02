import validator from 'validator';
import bcrypt, { hash } from "bcrypt";
import UserModel from '../model/UserModel.js';
import CreateToken from './CreateToken.js';
import { sendSignUpMail } from './Mailcontroller.js';


const SingUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const exist = await UserModel.findOne({ email });

        if (exist) {
            return res.status(400).json({ success: false, message: "User already exists !!!" });
        }

        if (!fullName || fullName.length < 5) {
            return res.status(400).json({ success: false, message: "FullName must above 5 characters !!!" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Email must be valid !!!" });
        }

        if (!password || !password === "") {
            return res.status(400).json({ success: false, message: "Password must be required !!!" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Strong password is required !!!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newuser = await UserModel.create({
            fullName,
            email,
            password: hashedpassword,
        });

        const user = await newuser.save();
        const frontend = process.env.FRONT_END;
        // new user will recieve mails for well come 
        try {
            await sendSignUpMail(email, fullName, res, frontend);
        }
        catch (error) {
            res.status(500).json({ success: false, message: "Failed to send well come email", error });
        }

        const token = await CreateToken(user._id, res);
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({ success: true, data: userWithoutPassword, token });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const Login = async (req, res) => { }

const UpdateProfile = async (req, res) => { }

const ForgetPassword = async (req, res) => { }

const UpdatePassword = async (req, res) => { }

export { SingUp, Login, UpdatePassword, UpdateProfile, ForgetPassword };