import mongoose, { Schema } from "mongoose";
const couponSchema = new Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: false,
  },
  validity: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  couponType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "percentage",
  },
  maxDiscount: {
    type: Number,
    required: false,
  },
});
export const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
