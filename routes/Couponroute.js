import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCouponCtrl,
  getCouponsCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
  getCouponCtrl,
} from "../controllers/CouponCtrl.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const CouponRouter = express.Router();

CouponRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
CouponRouter.get("/single", isLoggedIn, getCouponsCtrl);
CouponRouter.get("/:id", isLoggedIn, getCouponCtrl);
CouponRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
CouponRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);

export default CouponRouter;
