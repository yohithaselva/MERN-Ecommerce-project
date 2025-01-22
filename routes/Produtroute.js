import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  createProductCtrl,
  deleteProductsCtrl,
  getProductCtrl,
  getProductsCtrl,
  updateProductsCtrl,
} from "../controllers/Productctrl.js";
import upload from "../config/fileUpload.js";

const ProductRouter = express.Router();

ProductRouter.post(
  "/",
  upload.array("files"),
  isLoggedIn,
  isAdmin,
  createProductCtrl
); // for upload single file incase multiple file use array
ProductRouter.get("/", getProductCtrl);
ProductRouter.get("/:id", getProductsCtrl);
ProductRouter.put("/:id", isLoggedIn, isAdmin, updateProductsCtrl);
ProductRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductsCtrl);

export default ProductRouter;
