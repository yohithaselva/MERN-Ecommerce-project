import expressAsyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";
// create new coupon
//@route post/coupon
//@access private

export const createCouponCtrl = expressAsyncHandler(async (req, res) => {
  // omly admin create coupon chk if admin

  const { code, startDate, endDate, discount } = req.body;
  //check for coupon exist
  const couponExist = await Coupon.findOne({ code });
  if (couponExist) {
    //throw
    throw new Error("Coupon Already Exists");
  }
  //check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount should be a number");
  }
  //create a new coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  //send response
  res.status(201).json({
    status: "Success",
    message: "Coupon created successfully",
    data: coupon,
  });
});

// get all coupons
//@route get/getcoupons
//@access private

export const getCouponsCtrl = expressAsyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ user: req.userAuthId });
  res.status(200).json({
    status: "Success",
    message: "All coupons fetched successfully",
    data: coupons,
  });
});

// get single coupon
//@route get/coupons/:id
//@access private/admin

export const getCouponCtrl = expressAsyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

export const updateCouponCtrl = expressAsyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true, //updated document is returned
    }
  );
  res.json({
    status: "success",
    message: "coupon updated sucessfully",
    coupon,
  });
});

export const deleteCouponCtrl = expressAsyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "coupon deleted sucessfully",
    coupon,
  });
});
