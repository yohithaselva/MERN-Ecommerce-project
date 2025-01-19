import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/catogries.js";
import upload from "../config/fileUpload.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const categoriesRoute = express.Router();

categoriesRoute.post(
  "/category",
  upload.single("file"),
  isLoggedIn,
  isAdmin,
  createCategoryCtrl
);
categoriesRoute.get("/getcategory", getCategoriesCtrl);
categoriesRoute.get("/getcategory1/:id", getCategoryCtrl);
categoriesRoute.put(
  "/updatecategory/:id",
  isLoggedIn,
  isAdmin,
  updateCategoryCtrl
);
categoriesRoute.delete(
  "/deletecategory/:id",
  isLoggedIn,
  isAdmin,
  deleteCategoryCtrl
);

export default categoriesRoute;
