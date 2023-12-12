import About from "../models/aboutModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";

const postAbout = asyncHandler(async (req, res) => {
 const  id  = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }
  if (user.role != "admin") {
    return res
      .status(200)
      .json({ message: "You have no access", success: false });
  }

  const { about } = req.body;
  if (!about) {
    return res.status(200).json({
      success: false,
      message: "required field not found",
    });
  }
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const result = (await cloudinary.uploader.upload(req.file.path)) || "";

  const newAbout = new About({
    about,
    image: result.secure_url || "",
  });
  await newAbout.save();

  return res.status(200).json({
    About: newAbout, 
    success: true,
  });
});

const getAbout = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const about = await About.findById(id);
    if (!about) {
      return res
        .status(200)
        .json({ message: "About not found", success: false });
    }

    return res.status(200).json({ about, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const updateAbout = asyncHandler(async (req, res) => {
  const id  = req.user.id;
  const user = await User.findById(id);

  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }
  if (user.role != "admin") {
    return res
      .status(200)
      .json({ message: "You have no access", success: false });
  }
  const { about } = req.body;

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
    about,
    ...(imageUrl && { image: imageUrl }),
  };

  const options = { new: true };
  const updatedAbout = await About.findByIdAndUpdate(
    req.params.id,
    updates,
    options
  );
  if (!updatedAbout) {
    return res.status(404).json({ message: "About not found" });
  }

  return res.json({ updatedAbout });
});

export default { getAbout, postAbout, updateAbout };
