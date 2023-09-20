import express from "express";
import BarJuiceSuppliersController from "../controllers/barJuiceSuppliersController.js";
import { protect } from "../middleware/authenticationMiddleware.js";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
router
  .route("/")
  .post(
    protect,
    upload.single("image"),
    BarJuiceSuppliersController.postBarJuiceSuppliers
  );

  router.route("/").get(BarJuiceSuppliersController.getBarJuiceSuppliers);
  router.route("/:id").get(BarJuiceSuppliersController.getBarJuiceSuppliersById);

router
  .route("/")
  .patch(protect, upload.single("image"), BarJuiceSuppliersController.updateBarJuiceSupplier);

router.route("/:id").delete(protect, BarJuiceSuppliersController.deleteSupplier);

export default router;
