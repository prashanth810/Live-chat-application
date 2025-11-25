import express from "express";
import { getAllcontacts, getallchats, getmessagesbyid, sendMessages } from "../controller/Messagecontroller.js";
import Authmiddleware from "../middleawares/Authmiddleware.js";
import upload from "../config/cloundnary/Multer.js";


const messageroutes = express.Router();

messageroutes.use(Authmiddleware);

messageroutes.get("/contacts", Authmiddleware, getAllcontacts);
messageroutes.get("/chats", Authmiddleware, getallchats);
messageroutes.get("/chats/:recieverId", Authmiddleware, getmessagesbyid);

messageroutes.post("/send/:recieverId", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
]), sendMessages);

export default messageroutes;