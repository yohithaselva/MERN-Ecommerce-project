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
const brandRoute = express.Router();

brandRoute.post("/brand", isLoggedIn, isAdmin, createBrandCtrl);
brandRoute.get("/getbrands", getbrandsCtrl);
brandRoute.get("/getbrand/:id", getbrandCtrl);
brandRoute.put("/updatebrand/:id", isLoggedIn, isAdmin, updatebrandCtrl);
brandRoute.delete("/deletebrand/:id", isLoggedIn, isAdmin, deletebrandCtrl);

export default brandRoute;
