import expressAsyncHandler from "express-async-handler";
import product from "../models/product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
//create product
//api path /product
//access private/admin
export const createProductCtrl = expressAsyncHandler(async (req, res) => {
  const convertedImages = req.files.map((file) => file.path); // we need to store omly the path in db so we are mapping from req.body
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;
  //Product exists
  const productExists = await product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }
  //find category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "category not Found,please create category first or check category name"
    );
  }
  //find brand
  const brandFound = await Brand.findOne({
    name: brand,
  });
  if (!brandFound) {
    throw new Error(
      "brand not Found,please create brand first or check category name"
    );
  }
  //Create the product
  const products = await product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImages,
  });
  //Push product into category
  categoryFound.products.push(products._id);
  //resave
  await categoryFound.save();
  //Push product into brand
  brandFound.products.push(products._id);
  //resave
  await brandFound.save();

  //response
  res.json({
    status: "success",
    message: "Product created successfully",
    products,
  });
});

// Get all the products
// route /viewproduct
//access public
export const getProductCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.query);
  //query
  let productQuery = product.find();

  //search by name
  if (req.query.name) {
    // to get from the query the input
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" }, //to make the search ignore the case sensitive
    });
  }

  //search by brand
  if (req.query.brand) {
    // to get from the query the input
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" }, //to make the search ignore the case sensitive
    });
  }

  ////search by category
  if (req.query.category) {
    // to get from the query the input
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" }, //to make the search ignore the case sensitive
    });
  }
  //search by color
  if (req.query.colors) {
    // to get from the query the input
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" }, //to make the search ignore the case sensitive
    });
  }
  //search by size
  if (req.query.sizes) {
    // to get from the query the input
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" }, //to make the search ignore the case sensitive
    });
  }
  //filter by price range
  if (req.query.price) {
    // to get from the query the input
    //inorder to specify the range
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] }, //uses indexing for retrieve the position of the index
    });
  }
  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit how many data to display
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //start index
  const startIndex = (page - 1) * limit;
  //end index
  const endIndex = page * limit;
  //total product
  const total = await product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);
  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  //await the query
  const products = await productQuery.populate("reviews");

  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "product fetched sucessfully",
    products,
  });
});

// getting single product
//get/products/:id
//access public
export const getProductsCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const products = await product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "product fetched sucessfully",
    products,
  });
});

//update product
// put/products/update/:id
// access private
export const updateProductsCtrl = expressAsyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;
  //validation

  //update
  const products = await product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    products,
  });
});

//delete product
// put/products/delete/:id
// access private
export const deleteProductsCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const products = await product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "PRODUCT DELETED SUCESSFULLY",
  });
});
