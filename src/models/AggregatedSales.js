import mongoose from "mongoose";

const DailySalesSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    totalSales: { type: Number, required: true },
    invoiceCount: { type: Number, required: true },
    productSales: [
      {
        productCode: String,
        quantity: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

export const DailySales =
  mongoose.models.DailySales || mongoose.model("DailySales", DailySalesSchema);

const MonthlySalesSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalSales: { type: Number, required: true },
    invoiceCount: { type: Number, required: true },
    productSales: [
      {
        productCode: String,
        quantity: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

export const MonthlySales =
  mongoose.models.MonthlySales ||
  mongoose.model("MonthlySales", MonthlySalesSchema);

const YearlySalesSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    totalSales: { type: Number, required: true },
    invoiceCount: { type: Number, required: true },
    productSales: [
      {
        productCode: String,
        quantity: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

export const YearlySales =
  mongoose.models.YearlySales ||
  mongoose.model("YearlySales", YearlySalesSchema);
