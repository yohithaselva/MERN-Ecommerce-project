import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getOrderStats,
  getSingleOrderCtrl,
  updateOrderCtrl,
} from "../controllers/Orderctrl.js";
const OrderRouter = express.Router();

OrderRouter.post("/", isLoggedIn, createOrderCtrl);
OrderRouter.get("/", isLoggedIn, getAllordersCtrl);
OrderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
OrderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
OrderRouter.get("/sales/stats", isLoggedIn, getOrderStats);

export default OrderRouter;
