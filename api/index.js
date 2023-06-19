import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import categoryRoute from "./routes/categories.js";
import multer from "multer";
const app = express();
dotenv.config();

//mongodb connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected");
  } catch (error) {
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cd(null, "images");
  },
  filename: (req, file, cb) => {
    cd(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

//middleware
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(8000, () => {
  connect();
  console.log("backend is running");
});
