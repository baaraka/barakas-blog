import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import categoryRoute from "./routes/categories.js";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));

//mongodb connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected");
  } catch (error) {
    throw error;
  }
};

// //set up storage for upload files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./client/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// //create upload middleware
// const upload = multer({ storage: storage });

// //API endpoint for image upload
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

//error handling middleware
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

app.listen(8000, () => {
  connect();
  console.log("backend is running");
});
