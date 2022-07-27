const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connected to MONGODB"))
  .catch((err) => console.log("error"));

app.use("/", (req, res) => {
  console.log("hey this rama url");
});

app.listen("4000", () => {
  console.log("backend is running");
});
