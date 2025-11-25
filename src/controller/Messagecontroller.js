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
    try {
        const { text, image, video } = req.body;
        const { recieverId } = req.params;
        const senderId = req.user._id;

        if (!text || text.trim() === "") {
            return res.status(400).json({ success: false, message: "Text is required to send message !!!" });
        }

        if (senderId.equals(recieverId)) {
            return res.status(400).json({ success: false, message: "Cannot send messages to yourself !!!" });
        }

        const receiverExists = await UserModel.findById(recieverId);
        if (!receiverExists) {
            return res.status(404).json({ success: false, message: "Receiver not found !!!" });
        }

        let imageurl = "";
        let videourl = "";

        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "chat_images"
            });
            imageurl = uploadedImage.secure_url;
        }

        if (video) {
            const uploadedVideo = await cloudinary.uploader.upload(video, {
                resource_type: "video",
                folder: "chat_videos"
            });
            videourl = uploadedVideo.secure_url;
        }

        const newMessage = await MesssageModel.create({
            senderId,
            recieverId,
            text,
            image: imageurl,
            video: videourl
        });

        res.status(201).json({ success: true, data: newMessage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export { getAllcontacts, getallchats, getmessagesbyid, sendMessages };