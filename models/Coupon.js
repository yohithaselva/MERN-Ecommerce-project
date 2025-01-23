//coupon model
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// virtual property refers to that it exist logically but it will not be persisted in mongodb similar to data abstraction
//coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

CouponSchema.virtual("daysLeft").get(function () {
  const daysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " " +
    "Days left"; // milliseconds to days minutes hours and one day
  return daysLeft;
});
// mongoose supports certain middlewares known as pre function which can perform some operation even after saving it in db
//validation
CouponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    throw new Error("End date must be greater than start date");
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    throw new Error("start date cannot be less than today");
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    throw new Error("End date must be less than today's date");
  }
  next();
});
CouponSchema.pre("save", function (next) {
  //this is the global scope and it refers to the object that is exported in function
  if (this.discount <= 0 || this.dicount > 100) {
    throw new Error("Discount must be greater than 0 or greater than 100");
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
