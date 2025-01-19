import mongoose from "mongoose";
const Schema = mongoose.Schema;
//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderItems: [
      //created as an object for storing the individual product ordered by the user ref with products
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    }, // going to ref user another method is creating ref
    orderNumber: {
      type: String,
      default: randomTxt + randomNumbers, //for generating random no
    },
    //for stripe payment
    paymentStatus: {
      type: String,
      default: "Not paid", //this will be changed by webhook
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    //For admin
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"], //accepted values
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//compile to form model
const Order = mongoose.model("Order", OrderSchema);

export default Order;
