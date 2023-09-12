import express from "express";
import cartController from "../controllers/cartController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
const router = express.Router();

router.post("/", protect, cartController.addToCart);

router.get("/", protect, cartController.getCart);

router.patch("/:id", protect, cartController.clearCart);

router.patch("/inc/:itemId", protect, cartController.increaseQuantity);

router.put("/dec/:itemId", protect, cartController.decreaseQuantity);

export default router;
