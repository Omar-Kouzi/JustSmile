import express from "express";
import OfferController from "../controllers/offersController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), OfferController.postOffers);

router.route("/").get(OfferController.getOffers);

router.route("/:id").get(OfferController.getOfferById);

// router
//   .route("/")
//   .patch(protect, upload.single("image"), OfferController.updateOffer);

router.route("/:id").delete(protect, OfferController.deleteOffer);

export default router;
