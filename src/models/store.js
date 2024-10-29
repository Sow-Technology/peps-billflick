import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    storeName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String },
  },
  { timestamps: true }
);

export const Store =
  mongoose.models.Store || mongoose.model("Store", StoreSchema);
