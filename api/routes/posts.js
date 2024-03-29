import express from "express";
import Post from "../models/Post.js";
import multer from "multer";
import { createError } from "../utlis/Error.js";

const router = express.Router();

//CREATE POST
router.post("/", async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
});

//UPDATE POST
router.put("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        next(error);
      }
    } else {
      next(createError(401, "You can update only your post!."));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE POST
router.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("post has been deleted..");
      } catch (error) {
        next(error);
      }
    } else {
      next(createError(401, "You can delete only your post!."));
    }
  } catch (error) {
    next(error);
  }
});

//GET POST
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

//GET ALL POSTS
router.get("/", async (req, res, next) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

export default router;
