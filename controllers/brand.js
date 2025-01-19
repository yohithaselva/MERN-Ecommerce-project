import expressAsyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";

// route /brand
// private/admin

export const createBrandCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists or not
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("brand already exists");
  }
  //create
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "sucess",
    message: "brand created sucessfully",
    brand,
  });
});
// route /getbrand
// public
//get all categories
export const getbrandsCtrl = expressAsyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "sucess",
    message: "brands found sucessfully",
    brands,
  });
});

// route /getbrand:id
// public
//get single brand
export const getbrandCtrl = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.json({
    status: "sucess",
    message: "brand found sucessfully",
    brand,
  });
});

//update brand
//private
//route /updatebrand/:id
export const updatebrandCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //validation
  //update
  const brand = await Brand.findByIdAndUpdate(
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
    message: "Brand updated successfully",
    brand,
  });
});
//delete  brand
// put/deletebrand/:id
// access private
export const deletebrandCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const brand = await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Brand DELETED SUCESSFULLY",
  });
});
