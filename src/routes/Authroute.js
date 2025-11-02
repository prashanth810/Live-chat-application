import express from "express";
import { SingUp } from "../controller/Authcontroller.js";

const Authroute = express.Router();

Authroute.post("/user", SingUp);

export default Authroute;