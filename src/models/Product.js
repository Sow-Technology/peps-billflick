import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    productName: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
