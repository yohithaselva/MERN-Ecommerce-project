import expressAsyncHandler from "express-async-handler";
import Category from "../models/Category.js";
// route /category
// private/admin

export const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists or not
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("category already exists");
  }
  //create
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  res.json({
    status: "sucess",
    message: "category created sucessfully",
    category,
  });
});
// route /getcategory
// public
//get all categories
export const getCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: "sucess",
    message: "category found sucessfully",
    categories,
  });
});

// route /getcategory:id
// public
//get single categories
export const getCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({
    status: "sucess",
    message: "category found sucessfully",
    category,
  });
});

//update category
//private
//route /updatecategory/:id
export const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  //validation
  //update
  const category = await Category.findByIdAndUpdate(
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
    message: "category updated successfully",
    category,
  });
});
//delete category
// put/deletecategory/:id
// access private
export const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const category = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "category DELETED SUCESSFULLY",
  });
});
