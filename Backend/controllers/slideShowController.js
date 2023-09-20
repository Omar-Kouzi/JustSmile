import Slide from "../models/SlideshowModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
//===========

const postSlide = asyncHandler(async (req, res) => {
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

    const  result  = await cloudinary.v2.uploader.upload(req.file.path);
    const slideshow = new Slide({
      image: result.secure_url,
    });

    await slideshow.save();
    return res.status(200).json({
      slideshow,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

const getAll = asyncHandler(async (req, res) => {
  const all_Slides = await Slide.find();
  res.status(200).json({
    message: "getting all Slideshow images",
    all_Slides,
    success: true,
  });
});

const deleteSlide = async (req, res) => {
  const erase = await Slide.findByIdAndRemove(req.params.id);
  res.status(200).json({
    message: "Deleted a specific Slide",
    status: 200,
    data: erase,
  });
};

export default {
  getAll,
  postSlide,
  deleteSlide,
};
