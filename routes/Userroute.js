import express from "express";
import {
  login,
  register,
  userprofile,
  updateShippingAddressctrl,
} from "../controllers/Userctrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/profile", isLoggedIn, userprofile);
userRoute.put("/update/shipping", isLoggedIn, updateShippingAddressctrl);

export default userRoute;
