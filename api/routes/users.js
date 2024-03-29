import express from "express";
import { createError } from "../utlis/Error.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Post from "../models/Post.js";

const router = express.Router();

//UPDATE
router.put("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    next(createError(401, "You can update only your account!."));
  }
});

//DELETE
router.delete("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  } else {
    next(createError(404, "You can delete only your account!."));
  }
});

//GET USER
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
});

export default router;
