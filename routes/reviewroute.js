import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/review.js";

const reviewRouter = express.Router();
//we are going find a prod with id and review the particular product
reviewRouter.post("/review/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;
