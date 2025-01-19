import expressAsyncHandler from "express-async-handler";
import Color from "../models/Color.js";

// route /color
// private/admin

export const createcolorCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists or not
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("color already exists");
  }
  //create
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "sucess",
    message: "color created sucessfully",
    color,
  });
});
// route /getcolor
// public
//get all categories
export const getcolorsCtrl = expressAsyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.json({
    status: "sucess",
    message: "colors found sucessfully",
    colors,
  });
});

// route /getcolor:id
// public
//get single color
export const getcolorCtrl = expressAsyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  res.json({
    status: "sucess",
    message: "color found sucessfully",
    color,
  });
});

//update color
//private
//route /updatecolor/:id
export const updatecolorCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //validation
  //update
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "color updated successfully",
    color,
  });
});
//delete  color
// put/deletecolor/:id
// access private
export const deletecolorCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const color = await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "color DELETED SUCESSFULLY",
  });
});
