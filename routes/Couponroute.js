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

const CouponRoute = express.Router();

CouponRoute.post("/coupon", isLoggedIn, isAdmin, createCouponCtrl);
CouponRoute.get("/coupon", isLoggedIn, getCouponsCtrl);
CouponRoute.get("/coupon/:id", isLoggedIn, getCouponCtrl);
CouponRoute.put("/updatecoupon/:id", isLoggedIn, isAdmin, updateCouponCtrl);
CouponRoute.delete("/deletecoupon/:id", isLoggedIn, isAdmin, deleteCouponCtrl);

export default CouponRoute;
