import express from "express";
import UsersController from "../controllers/userController.js";
import { protect } from "../middleware/authenticationMiddleware.js";

const router = express.Router();

router.route("/").post(UsersController.registerUser);

router.route("/login").post(UsersController.login);

router.route("/").get(UsersController.getAllUsers);

router.route("/:id").get(UsersController.getUserById);

router.route("/").patch(protect, UsersController.updateUserProfile);

router.route("/:id").delete(protect, UsersController.deleteUser);

export default router;
