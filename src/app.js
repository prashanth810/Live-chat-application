import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Authroute from "./routes/Authroute.js";
import messageroutes from "./routes/MessageRoute.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8010;

// middle wars section 
app.use(express.json());
app.use(cors());
app.use(morgan());
app.use(helmet());


// All routes section 
app.use("/api/auth", Authroute);
app.use("/api/auth", messageroutes)


app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Livechat backend is running" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


