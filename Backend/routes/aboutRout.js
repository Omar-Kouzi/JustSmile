import express from "express";
import aboutController from "../controllers/aboutController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), aboutController.postAbout);

router.route("/:id").get(aboutController.getAbout);

router
  .route("/:id")
  .patch(protect, upload.single("image"), aboutController.updateAbout);


export default router;
