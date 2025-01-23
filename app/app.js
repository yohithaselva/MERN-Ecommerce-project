import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import Stripe from "stripe";
import dbconnect from "../config/dbconnect.js";
import userRoute from "../routes/Userroute.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import ProductRouter from "../routes/Produtroute.js";
import categoriesRouter from "../routes/categoriesroute.js";
import brandRouter from "../routes/brandroute.js";
import colorRouter from "../routes/Colorroute.js";
import reviewRouter from "../routes/reviewroute.js";
import OrderRouter from "../routes/Orderroutes.js";
import Order from "../models/Order.js";
import CouponRouter from "../routes/Couponroute.js";
// to connect db
dbconnect();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//Stripe webhooke API it should be always above all the route app including express.json()
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_KEY);
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret =
  "whsec_2ea1c5a17724292d98827b8699ff85bce38bc8db41bbc176113a65aea57de0ac"; // should not have any whitespace
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order status
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total; //to bring the details from stripe
      const currency = session.currency;
      //find the order
      const order = await Order.findById(
        JSON.parse(orderId), //To convert the json to object id
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
    } else {
      return;
    }

    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     console.log(
    //       `PaymentIntent for ${paymentIntent.amount} was successful!`
    //     );
    //     // Then define and call a method to handle the successful payment intent.
    //     // handlePaymentIntentSucceeded(paymentIntent);
    //     break;
    //   case "payment_method.attached":
    //     const paymentMethod = event.data.object;
    //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //     // handlePaymentMethodAttached(paymentMethod);
    //     break;
    //   default:
    //     // Unexpected event type
    //     console.log(`Unhandled event type ${event.type}.`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
// Inorder to avoid payload
app.use(express.json());

//routes
//Home route
app.use("/user", userRoute);
app.use("/products", ProductRouter);
app.use("/category", categoriesRouter);
app.use("/brands", brandRouter);
app.use("/color", colorRouter);
app.use("/review", reviewRouter);
app.use("/order", OrderRouter);
app.use("/coupon", CouponRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
