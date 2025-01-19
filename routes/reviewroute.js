import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/review.js";

const reviewRoute = express.Router();
//we are going find a prod with id and review the particular product
reviewRoute.post("/review/:productID", isLoggedIn, createReviewCtrl);

export default reviewRoute;
