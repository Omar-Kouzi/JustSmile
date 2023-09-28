import Recommended from "../models/recommendedItemsModel.js";
import Item from "../models/itemModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
//============

const postRecommended = asyncHandler(async (req, res) => {
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
  console.log(req.body);
  const itemId = req.body.id;
  if (!itemId) {
    return res
      .status(200)
      .json({ message: "Missing required fields", success: false });
  }
  const item = await Item.findById(itemId);

  if (!item) {
    return res.status(200).json({ message: "item not found" });
  }
  try {
    const recommended = new Recommended({
      _id: item._id,
      description: item.description,
      title: item.title,
      price: item.price,
      image: item.image,
    });

    await recommended.save();
    return res.status(200).json({
      recommended,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

//============

const getRecommended = asyncHandler(async (req, res) => {
  const recommended = await Recommended.find();
  res.json(recommended);
});

//============

const deleteRecommended = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const recommended = await Recommended.findByIdAndDelete(id);
    if (recommended) {
      // Document was found and deleted
      return res.status(200).json({
        message: `${id} had been deleted successfully`,
        success: true,
      });
    } else {
      // Document with the specified ID was not found
      return res.status(200).json({
        message: `${id} not found`,
        success: false,
      });
    }
  } catch (error) {
    // Handle the error, e.g., log it and return an error response
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default {
  postRecommended,
  getRecommended,
  deleteRecommended,
};
