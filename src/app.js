import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Authroute from "./routes/Authroute.js";
import messageroutes from "./routes/MessageRoute.js";
import ConnectionDB from "./config/Db.js";
// import path from "path";


dotenv.config();

const app = express();
const PORT = Envs.PORT || 8010;

// middle wars section 
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan());
app.use(helmet());
app.use(cookieParser());


// const __dirname = path.resolve();


// All routes section 
app.use("/api/auth", Authroute);
app.use("/api/auth", messageroutes)


app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Livechat backend is running" })
})


// ready to deployement 
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../forntend/dist")));
// }

// // get only front end 
// app.get(/.*/, (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// });


// db connection 
ConnectionDB().then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }
    catch (error) {
        console.log("eroor while connecting server !!!")
    }
})



