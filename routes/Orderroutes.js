import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getOrderStats,
  getSingleOrderCtrl,
  updateOrderCtrl,
} from "../controllers/Orderctrl.js";
const OrderRoute = express.Router();

OrderRoute.post("/orders", isLoggedIn, createOrderCtrl);
OrderRoute.get("/getorders", isLoggedIn, getAllordersCtrl);
OrderRoute.get("/getOrder/:id", isLoggedIn, getSingleOrderCtrl);
OrderRoute.put("/updateorder/:id", isLoggedIn, updateOrderCtrl);
OrderRoute.get("/sales/stats", isLoggedIn, getOrderStats);

export default OrderRoute;
