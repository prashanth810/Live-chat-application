import mongoose from 'mongoose';

const MessssageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uer",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
}, { timestamps: true, minimize: false });

const MesssageModel = mongoose.model("message", MessssageSchema);

export default MesssageModel;