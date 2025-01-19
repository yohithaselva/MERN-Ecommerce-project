import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    //for reference key from other model only the id
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    // To ensure admin or not user
    isAdmin: {
      type: Boolean,
      default: true,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    ShippingAddress: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      Pincode: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
//compile schema
const user = mongoose.model("user", UserSchema);
export default user;
