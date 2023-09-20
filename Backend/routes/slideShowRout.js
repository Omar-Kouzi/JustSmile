import express from "express";
import SlideshowController from "../controllers/slideShowController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.route("/").get(SlideshowController.getAll);
router.route("/:id").delete(protect, SlideshowController.deleteSlide);
router.route("/").post(protect, upload.single("image"),SlideshowController.postSlide);

export default router;
