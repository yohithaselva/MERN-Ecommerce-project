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

const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn, isAdmin, createcolorCtrl);
colorRouter.get("/", getcolorsCtrl);
colorRouter.get("/:id", getcolorCtrl);
colorRouter.put("/:id", isLoggedIn, isAdmin, updatecolorCtrl);
colorRouter.delete("/:id", isLoggedIn, isAdmin, deletecolorCtrl);

export default colorRouter;
