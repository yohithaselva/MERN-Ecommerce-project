import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createBrandCtrl,
  deletebrandCtrl,
  getbrandCtrl,
  getbrandsCtrl,
  updatebrandCtrl,
} from "../controllers/brand.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn, isAdmin, createBrandCtrl);
brandRouter.get("/get", getbrandsCtrl);
brandRouter.get("/:id", getbrandCtrl);
brandRouter.put("/:id", isLoggedIn, isAdmin, updatebrandCtrl);
brandRouter.delete("/:id", isLoggedIn, isAdmin, deletebrandCtrl);

export default brandRouter;
