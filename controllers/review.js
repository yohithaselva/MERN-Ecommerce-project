import asyncHandler from "express-async-handler";
import product from "../models/product.js";
import Review from "../models/Review.js";
//create new review
//post /review
//access private admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  //1. Find the product
  const { productID } = req.params;
  const productFound = await product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  //check if user already reviewed this product to avoid duplication of product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }
  //create review
  const review = await Review.create({
    message,
    rating,
    products: productFound?._id,
    user: req.userAuthId,
  });
  //Push review into product Found
  productFound.reviews.push(review?._id);
  //resave
  await productFound.save();
  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
