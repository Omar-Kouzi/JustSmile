import asyncHandler from "express-async-handler";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
//============

const postItem = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }
  if (user.role != "admin") {
    return res
      .status(200)
      .json({ message: "You have no access", success: false });
  }
  const {
    title,
    description,
    ingredients,
    flavor,
    price,
    category,
    available,
  } = req.body;
  console.log(req.body)
  // if (
  //   !title ||
  //   !description ||
  //   !ingredients ||
  //   !price ||
  //   !category ||
  //   !flavor ||
  //   !available
  // ) {
  //   return res
  //     .status(200)
  //     .json({ message: "Missing required fields", success: false });
  // }

  if (!req.file || req.file.length === 0) {
    return res
      .status(200)
      .json({ message: "Image file is missing", success: false });
  }

  try {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const result = await cloudinary.v2.uploader.upload(req.file.path);

    const parsedIngredients = ingredients.split(/;|,/).map((i) => i.trim());
    const item = new Item({
      title,
      description,
      ingredients: parsedIngredients,
      price,
      flavor,
      image: result.secure_url,
      category,
      available: available || true,
    });

    await item.save();
    return res.status(200).json({
      item,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

//============

const getAllItems = asyncHandler(async (req, res) => {
  const item = await Item.find();
  res.json(item);
});

//============

const getAllItemByid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  res.json(item);
});

//============

const updateItem = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);

  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }
  if (user.role != "admin") {
    return res
      .status(200)
      .json({ message: "You have no access", success: false });
  }
  const { title, description, ingredients, flavor, price, category,available } = req.body;

  // Check if there is a new image
  let imageUrl;
  if (req.file) {
    try {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const result = await cloudinary.v2.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  const updates = {
    title,
    description,
    flavor,
    price,
    category,
    ingredients: ingredients,
    available,
    ...(imageUrl && { image: imageUrl }),
  };

  const options = { new: true };
  const item = await Item.findByIdAndUpdate(req.body.id, updates, options);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  return res.json({ item });
});

//=============

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findByIdAndDelete(id);
  if (item) {
    return res.status(200).json({
      message: `${id} had been deleted successfully`,
      success: true,
    });
  } else
    return res.status(200).json({ message: `${id} not found`, success: false });
});

export default {
  postItem,
  getAllItems,
  getAllItemByid,
  updateItem,
  deleteItem,
};