import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudnary from "./Cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudnary, // REQUIRED property
    params: {
        folder: "chat_media",
        resource_type: "auto",
    },
});

const upload = multer({ storage });

export default upload;
