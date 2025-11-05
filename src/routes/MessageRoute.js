import express from "express";
import { getAllcontacts, getallchats, getmessagesbyid, sendMessages } from "../controller/Messagecontroller.js";
import Authmiddleware from "../middleawares/Authmiddleware.js";


const messageroutes = express.Router();

messageroutes.use(Authmiddleware);

messageroutes.get("/contacts", getAllcontacts);
messageroutes.get("/chats", getallchats);
messageroutes.get("/chats/:recieverId", getmessagesbyid);

messageroutes.post("/send/:recieverId", sendMessages);

export default messageroutes;