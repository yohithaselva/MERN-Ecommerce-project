import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createcolorCtrl,
  deletecolorCtrl,
  getcolorCtrl,
  getcolorsCtrl,
  updatecolorCtrl,
} from "../controllers/colorCtrl.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const colorRoute = express.Router();

colorRoute.post("/color", isLoggedIn, isAdmin, createcolorCtrl);
colorRoute.get("/getcolors", getcolorsCtrl);
colorRoute.get("/getcolor/:id", getcolorCtrl);
colorRoute.put("/updatecolor/:id", isLoggedIn, isAdmin, updatecolorCtrl);
colorRoute.delete("/deletecolor/:id", isLoggedIn, isAdmin, deletecolorCtrl);

export default colorRoute;
