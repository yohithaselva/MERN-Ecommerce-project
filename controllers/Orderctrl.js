import expressAsyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/Order.js";
import user from "../models/user.js";
import product from "../models/product.js";
import dotenv from "dotenv";
import Coupon from "../models/Coupon.js";

dotenv.config();
//create orders
//route post/orders
//access private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = expressAsyncHandler(async (req, res) => {
  //get the coupon
  const { coupon } = req.query;
  const couponExist = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });
  if (couponExist?.isExpired) {
    throw new Error("Coupon is expired");
  }
  if (!couponExist) {
    throw new Error("Invalid Coupon");
  }
  // get discount
  const discount = couponExist?.discount / 100; //get the payloadcustomer,orderitem,shippingaddress,totalprice;
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //find user
  const User = await user.findById(req.userAuthId);
  //check if user as shipping address
  if (!User?.hasShippingAddress) {
    throw new Error("Please add shipping address");
  }
  //check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("no order items");
  }
  //place/create order -save into db
  const order = await Order.create({
    user: User._id, //assinged the value got from const //because its inside controllers
    orderItems,
    shippingAddress,
    totalPrice: couponExist ? totalPrice - totalPrice * discount : totalPrice, // if the coupon is applied
  });
  //Update the product quantities in the order
  const products = await product.find({
    _id: { $in: orderItems.map((item) => item._id) },
  });

  for (const orderItem of orderItems) {
    const Product = products.find(
      (prod) => prod._id.toString() === orderItem._id.toString()
    );
    if (Product) {
      Product.totalSold += orderItem.qty;
      await Product.save(); // Save updated product to DB
    }
  }

  // Push the order into the user's orders array
  if (!User.orders) {
    User.orders = []; // Initialize if undefined
  }
  User.orders.push(order._id);
  await User.save();

  //make payment(stripe)
  //convert order items to have same structure that stripe required
  const convertedOrderItems = orderItems.map((item) => {
    return {
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrderItems,
    metadata: { orderId: JSON.stringify(order?._id) }, //store order id in stripe and update the hooke It should be in string not in hash
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });

  //payment wehook for sucessful payment and notifcation in the website.
  //update the user order
  // res.json({
  //   success: true,
  //   message: "Order created",
  //   order,
  //   user,
  // });
});

//get all orders
//route get/orders
//access private
export const getAllordersCtrl = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.userAuthId }).populate(
    "orderItems._id"
  );
  res.json(orders);
});

//get single order
//getorder route
//private/admin

export const getSingleOrderCtrl = expressAsyncHandler(async (req, res) => {
  //get the id from the params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    order,
  });
});

// update order to delivered
// route put/updateorder/:id
// private/admin

export const updateOrderCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

// to display some of all orders
// route get/orders/sales/sum
//@access private/admin

export const getOrderStats = expressAsyncHandler(async (req, res) => {
  //get sales
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null, //group me all the ids which are not null
        totalSales: {
          $sum: "$totalPrice",
        },
        minimumSales: {
          $min: "$totalPrice",
        },
        maximumSales: {
          $max: "$totalPrice",
        },
        avgSales: {
          $avg: "$totalPrice",
        }, // aggregation pipeline
      },
    },
  ]); // this helps to perform various aggregation function inside the array
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        }, // inorder to get the sales of today gte means greater than or equal to
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      }, //grp and sum of total sale
    },
  ]);
  //send message
  res.status(200).json({
    success: true,
    message: "Order Summary",
    orders,
    salesToday,
  });
});
