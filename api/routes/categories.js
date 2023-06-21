import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

//CREATE CATEGORIES
router.post("/", async (req, res, next) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (error) {
    next(error);
  }
});

//GET CATEGORIES
router.post("/", async (req, res, next) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (error) {
    next(error);
  }
});

export default router;
