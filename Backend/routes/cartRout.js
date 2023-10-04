import cartController from "../controllers/cartController.js";
import express from "express";
import { protect } from "../middleware/authenticationMiddleware.js";

const router = express.Router();

router.route("/").post(protect, cartController.addToCart);

router.route("/").get(protect, cartController.getCart);

router.route("/").patch(protect, cartController.clearCart);

router.route("/inc/:itemId").patch(protect, cartController.increaseQuantity);

router.route("/dec/:itemId").put(protect, cartController.decreaseQuantity);


export default router;
