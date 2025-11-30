import validator from 'validator';
import bcrypt, { hash } from "bcrypt";
import UserModel from '../model/UserModel.js';
import CreateToken from './CreateToken.js';
import { sendSignUpMail } from './Mailcontroller.js';
import cloudinary from 'cloudinary';
import Envs from '../envs/Envs.js';


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
        const frontend = Envs.FRONT_END;
        // new user will recieve mails for well come 
        // try {
        sendSignUpMail(email, fullName, res, frontend);
        // }
        // catch (error) {
        //     res.status(500).json({ success: false, message: "Failed to send well come email", error });
        // }

        const token = await CreateToken(user._id, res);
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({ success: true, data: userWithoutPassword, token });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!email || email === "") {
            return res.status(400).json({ success: false, message: "Email is required !!!" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter valid email !!!" });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid creadiantials !!!" });
        }

        if (!password || password === "") {
            return res.status(400).json({ success: false, message: "Password is required !!!" });
        }

        if (password.length < 5) {
            return res.status(400).json({ success: false, message: "Password must above 5 characters !!!" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "String password is required !!!" });
        }

        const ispassword = await bcrypt.compare(password, user.password);
        if (!ispassword) {
            return res.status(400).json({ success: false, message: "Invalid creadentails !!!" });
        }

        const token = CreateToken(user._id, res);

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ success: true, data: userWithoutPassword, token })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const UpdateProfile = async (req, res) => {
    const { fullName, profile } = req.body;
    try {
        const user = req.user._id;

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid creadiantils !!!" });
        }

        if (!fullName || !fullName === "") {
            return res.status(400).json({ success: false, message: "Full name is required !!!" });
        }

        if (fullName.length < 5) {
            return res.status(400).json({ success: false, message: "full name must be above 5 characters !!!" });
        }

        if (!profile) {
            return res.status(400).json({ success: false, message: "profile pic is required !!!" });
        }

        const uploadprofiles = await cloudinary.uploader.upload(profile);

        const updateduser = await UserModel.findByIdAndUpdate(user,
            {
                fullName,
                profile: uploadprofiles.secure_url
            },
            { new: true }
        ).select("-password");

        res.status(200).json({ success: true, data: updateduser })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const ForgetPassword = async (req, res) => { }

const UpdatePassword = async (req, res) => { }

const Logout = async (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout successfully !!!" });
};

const Loginprofile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            res.status(404).json({ success: false, message: "Invalid creadiantails !!!" });
        }

        res.status(200).json({ success: true, data: user })

    }
    catch (eroor) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const userbyid = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);

        if (!user) {
            res.status(404).json({ success: false, message: "Invalid creadiantails !!!" });
        }

        res.status(200).json({ success: true, data: user })

    }
    catch (eroor) {
        res.status(500).json({ success: false, message: eroor.message })
    }
}

export { SingUp, Login, UpdatePassword, UpdateProfile, ForgetPassword, Logout, Loginprofile, userbyid };