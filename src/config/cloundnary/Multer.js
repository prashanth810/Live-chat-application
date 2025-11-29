import multer from "multer";

// Save uploaded files temporarily in /uploads folder
const upload = multer({
    dest: "chat_media",
});

export default upload;
