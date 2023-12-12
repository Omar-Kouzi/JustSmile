import Offers from "../models/offersModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
//============

const postOffers = asyncHandler(async (req, res) => {
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
  const { title, description, price, size } = req.body;
  if (!title || !description || !price) {
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

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const offer = new Offers({
      title,
      description,
      sizePrice: { size: size, price: price },
      image: result.secure_url,
    });

    await offer.save();
    return res.status(200).json({
      offer,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

//============

const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offers.find();
  res.json(offers);
});

//============

const getOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const offer = await Offers.findById(id);
  res.json(offer);
});

//============

// const updateOffer = asyncHandler(async (req, res) => {
//   const id = req.user.id;
//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(200).json({ message: "User not found", success: false });
//   }
//   if (user.role !== "admin") {
//     return res
//       .status(200)
//       .json({ message: "You have no access", success: false });
//   }

//   const { id: offerId, title, description, price } = req.body;

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

//   const options = { new: true };

//   const updates = {
//     title,
//     description,
//     price,
//     ...(imageUrl && { image: imageUrl }),
//   };

//   const updatedOffer = await Offers.findByIdAndUpdate(
//     offerId,
//     updates,
//     options
//   );

//   if (!updatedOffer) {
//     return res
//       .status(200)
//       .json({ message: "Supplier not found", success: true });
//   }

//   return res.status(200).json({ updatedOffer, success: true });
// });

const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Offers.findByIdAndDelete(id);
  if (item) {
    return res.status(200).json({
      message: `${id} had been deleted successfully`,
      success: true,
    });
  } else
    return res.status(200).json({ message: `${id} not found`, success: false });
});

export default {
  postOffers,
  getOffers,
  getOfferById,
  deleteOffer,
};
