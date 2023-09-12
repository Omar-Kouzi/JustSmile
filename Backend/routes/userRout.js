import express from "express";
import UsersController from "../controllers/userController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(upload.single("image"), UsersController.registerUser);

router.route("/login").post(UsersController.login);

router.route("/").get(UsersController.getAllUsers);

router.route("/user").get(UsersController.getUserById);

router.route("/:id").patch(protect, upload.single("image"), UsersController.updateUserProfile);

router.route("/:id").delete(protect,UsersController.deleteUser);

export default router;
