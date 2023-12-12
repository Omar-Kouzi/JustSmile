import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//============
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, address } = req.body;
  if (!name || !email || !password) {
    return res
      .status(200)
      .json({ message: "Missing required fields", success: false });
  }

  const existingUser = await User.findOne({ $or: [{ name }, { email }] });
  if (existingUser) {
    if (existingUser.email === email) {
      return res
        .status(200)
        .json({ message: "Email must be unique", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "Name must be unique", success: false });
    }
  }
  const user = new User({
    name,
    email,
    password,
    address,
    role: role || "user",
    success: true,
  });

  await user.save();
  res.status(200).json({
    user: user,
    message: "Account created successfully",
    token: generateToken(user._id),
    success: true,
  });
});

//============

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(200).json({
      message: "Please enter an email",
      success: false,
    });
  }
  if (!password) {
    return res.status(200).json({
      message: "Please enter an password",
      success: false,
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message: "This email doesn't belong to any user",
      success: false,
    });
  }
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      phoneNumber: user.phoneNumber,
      success: true,
      message: "logged in successfully",
    });
  } else {
    return res
      .status(200)
      .json({ message: "Incorrect password", success: false });
  }
});

//============

const updateUserProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(200).json({ message: "User not found", success: false });
  }

  if (req.body.oldPassword) {
    const isPasswordMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(200)
        .json({ message: "Old password is incorrect", success: false });
    }
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.address = req.body.address || user.address;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  return res.status(200).json({
    updatedUser: updatedUser,
    token: generateToken(updatedUser._id),
    success: true,
  });
});

//============

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

//============

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const users = await User.findById(id);
  res.json(users);
});

//============

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(200).json({
      message: `couldn't find user ${id}`,
      success: false,
    });
  }
  const deletedUser = await User.findByIdAndDelete(id);
  if (deletedUser) {
    return res.status(200).json({
      message: `user had been deleted successfully`,
      success: true,
    });
  } else
    return res.status(200).json({ message: `user not found`, success: false });
});

export default {
  registerUser,
  updateUserProfile,
  getAllUsers,
  getUserById,
  login,
  deleteUser,
};
