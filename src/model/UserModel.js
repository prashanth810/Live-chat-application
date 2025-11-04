import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: "",
    },
}, { timestamps: true, minimize: false });

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;