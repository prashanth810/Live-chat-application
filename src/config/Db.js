import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongo_url = process.env.MONGO_URL;

if (!mongo_url) throw new error("Mongo url is required !!!");

const ConnectionDB = async () => {
    try {
        await mongoose.connect(mongo_url);
        console.log("Mongo DB connected Successfully !!!");
    } catch (error) {
        console.log("DB not connected !!!", error.message);
    }
};

export default ConnectionDB;
