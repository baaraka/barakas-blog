import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utlis/Error.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    await newUser.save();
    res.status(200).json("User created successfully");
  } catch (error) {
    next(error);
  }
});

//LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(400, "User not found."));

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated)
      return next(createError(400, "wrong password or username!."));

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
