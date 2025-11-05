import express from "express";
import { Login, Logout, SingUp, UpdateProfile, Loginprofile } from "../controller/Authcontroller.js";
import Authmiddleware from "../middleawares/Authmiddleware.js";

const Authroute = express.Router();

// get login user profile data only 
Authroute.get("/profile", Authmiddleware, Loginprofile);

Authroute.post("/register", SingUp);
Authroute.post("/login", Login);

Authroute.put("/updateprofile", Authmiddleware, UpdateProfile);




Authroute.post("/logout", Logout);

export default Authroute;