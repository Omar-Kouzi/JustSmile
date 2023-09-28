import express from "express";
import ItemController from "../controllers/itemController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), ItemController.postItem);

router.route("/").get(ItemController.getAllItems);

router.route("/:id").get(ItemController.getAllItemByid);

router
  .route("/")
  .patch(protect, upload.single("image"), ItemController.updateItem);

router.route("/:id").delete(protect, ItemController.deleteItem);

export default router;
