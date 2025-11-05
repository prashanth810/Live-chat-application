import { json } from "express";
import UserModel from "../model/UserModel.js";
import MesssageModel from "../model/Messagemodel.js";
import cloudinary from 'cloudinary';


const getAllcontacts = async (req, res) => {
    try {
        const loedinluser = req.user._id;
        const filterUsers = await UserModel.find({ _id: { $ne: loedinluser } }).select("-password");

        res.status(200).json({ success: true, data: filterUsers })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getallchats = async (req, res) => {
    try {
        const logedinuser = req.user._id;

        const message = await MesssageModel.find({
            $or: [
                { senderId: logedinuser },
                { recieverId: logedinuser },
            ]
        });

        const chatpartnerIds = [...new Set(message.map((msg) => msg.senderId.toString() === logedinuser.toString()
            ? msg.recieverId.toString()
            : msg.senderId.toString())
        )];

        const chatpartners = await UserModel.find({ _id: { $in: chatpartnerIds } }).select("-password");

        res.status(200).json({ success: true, data: chatpartners });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getmessagesbyid = async (req, res) => {
    const { recieverId } = req.params;
    try {
        const myid = req.user._id;
        const messsages = await MesssageModel.find({
            $or: [
                { senderId: myid, recieverId: recieverId },
                { senderId: recieverId, recieverId: myid }
            ]
        });

        res.status(200).json({ success: true, data: messsages });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const sendMessages = async (req, res) => {
    const { text, image, video } = req.body;
    const { recieverId } = req.params;
    try {
        const senderId = req.user._id;

        let imageurl;
        let videourl;

        if (image) {
            const uploadimages = await cloudinary.uploader.upload(image)
            imageurl = uploadimages.secure_url;
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({ success: false, message: "Text is required to send message !!!" });
        }

        if (video) {
            const uplaodvideo = await cloudinary.uploader.upload(video);
            videourl = uplaodvideo.secure_url;
        }

        const newmessage = new MesssageModel({
            senderId,
            recieverId,
            text,
            image: imageurl,
            video: videourl,
        })

        const messages = await newmessage.save();

        res.status(201).json({ success: true, data: messages })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { getAllcontacts, getallchats, getmessagesbyid, sendMessages };