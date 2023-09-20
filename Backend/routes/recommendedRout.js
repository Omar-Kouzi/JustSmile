import express from "express";
import RecommendedController from "../controllers/recommendedController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
const router = express.Router();

router.route("/").get(RecommendedController.getRecommended);
router.route("/:id").delete(protect, RecommendedController.deleteRecommended);
router.route("/").post(protect, RecommendedController.postRecommended);

export default router;
