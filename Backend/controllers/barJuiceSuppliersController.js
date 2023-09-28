import BarJuiceSuppliers from "../models/barJuiceSuppliersModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
//============

const postBarJuiceSuppliers = asyncHandler(async (req, res) => {
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
  const { title, description, location } = req.body;
  if (!title || !description || !location) {
    return res
      .status(200)
      .json({ message: "Missing required fields", success: false });
  }

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

    console.log(req.body.links);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const links = JSON.parse(req.body.links);

    const barJuiceSuppliers = new BarJuiceSuppliers({
      title,
      description,
      links: links,
      image: result.secure_url,
      location,
    });
    console.log(barJuiceSuppliers);
    await barJuiceSuppliers.save();
    return res.status(200).json({
      barJuiceSuppliers,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

//============

const getBarJuiceSuppliers = asyncHandler(async (req, res) => {
  const item = await BarJuiceSuppliers.find();
  res.json(item);
});

//============

const getBarJuiceSuppliersById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const barJuiceSuppliers = await BarJuiceSuppliers.findById(id);
  res.json(barJuiceSuppliers);
});

//============

// const updateBarJuiceSupplier = asyncHandler(async (req, res) => {
//   const  id = req.user.id;
//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(200).json({ message: "User not found", success: false });
//   }
//   if (user.role != "admin") {
//     return res
//       .status(200)
//       .json({ message: "You have no access", success: false });
//   }
//   const { title, description, location, linkTitle, link  } = req.body;

//   // Check if there is a new image
//   let imageUrl;
//   if (req.file) {
//     try {
//       cloudinary.v2.config({
//         cloud_name: process.env.CLOUD_NAME,
//         api_key: process.env.API_KEY,
//         api_secret: process.env.API_SECRET,
//       });

//       const result = await cloudinary.v2.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }

//   const updates = {
//     title,
//     description,
//     flavor,
//     price,
//     category,
//     ingredients: ingredients,
//     ...(imageUrl && { image: imageUrl }),
//   };

//   const options = { new: true };
//   const item = await Item.findByIdAndUpdate(req.body.id, updates, options);
//   if (!item) {
//     return res.status(404).json({ message: "Item not found" });
//   }

//   return res.json({ item });
// });

//=============

const updateBarJuiceSupplier = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);

  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }
  if (user.role !== "admin") {
    return res
      .status(200)
      .json({ message: "You have no access", success: false });
  }

  const { id: supplierId, title, description, location } = req.body;

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
  const links = JSON.parse(req.body.links);

  console.log(links);
  const options = { new: true };

  const updates = {
    title,
    description,
    location,
    links: links,
    ...(imageUrl && { image: imageUrl }),
  };

  const updatedSupplier = await BarJuiceSuppliers.findByIdAndUpdate(
    supplierId,
    updates,
    options
  );

  if (!updatedSupplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }

  return res.json({ updatedSupplier });
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await BarJuiceSuppliers.findByIdAndDelete(id);
  console.log(id);
  if (item) {
    return res.status(200).json({
      message: `${id} had been deleted successfully`,
      success: true,
    });
  } else
    return res.status(200).json({ message: `${id} not found`, success: false });
});

export default {
  postBarJuiceSuppliers,
  getBarJuiceSuppliers,
  getBarJuiceSuppliersById,
  updateBarJuiceSupplier,
  deleteSupplier,
};
