import express from "express";
import catetgoryFileUpload from "../config/CategoryUpload.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/catogries.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  isLoggedIn,
  catetgoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:id", getCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn, isAdmin, updateCategoryCtrl);
categoriesRouter.delete("/:id", isLoggedIn, isAdmin, deleteCategoryCtrl);
export default categoriesRouter;
