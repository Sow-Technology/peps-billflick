import mongoose, { Schema } from "mongoose";
const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
});
export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
