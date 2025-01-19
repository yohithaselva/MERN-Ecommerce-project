//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //to populate as the real object
  }
);
//virtuals for querying and retrieve the data
//qty left
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});
// total rating
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length; // this will return the reviews count which is stored in the instance known as product
});
//avg rating
ProductSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    ratingsTotal += review?.rating; //for taking the rating and adding upon it from review table
  });
  //calc avg rating sum of rating/total no of reviews
  const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
    1
  );
  return averageRating;
});
const product = mongoose.model("product", ProductSchema);

export default product;
