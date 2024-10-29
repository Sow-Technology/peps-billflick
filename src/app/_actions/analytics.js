import dbConnect from "@/lib/dbConnect";
import {
  DailySales,
  MonthlySales,
  YearlySales,
} from "@/models/AggregatedSales";

export async function updateAggregatedData(invoice, session) {
  await dbConnect();
  const date = new Date(invoice.createdAt);
  date.setHours(0, 0, 0, 0);

  // Update DailySales
  await DailySales.findOneAndUpdate(
    { date },
    {
      $inc: {
        totalSales: invoice.subTotal,
        invoiceCount: 1,
      },
      $push: {
        productSales: invoice.items.map((item) => ({
          productCode: item.code,
          quantity: item.quantity,
          revenue: item.unitPrice * item.quantity,
        })),
      },
    },
    { upsert: true, new: true, session }
  );

  // Update MonthlySales
  await MonthlySales.findOneAndUpdate(
    { year: date.getFullYear(), month: date.getMonth() + 1 },
    {
      $inc: {
        totalSales: invoice.subTotal,
        invoiceCount: 1,
      },
      $push: {
        productSales: invoice.items.map((item) => ({
          productCode: item.code,
          quantity: item.quantity,
          revenue: item.unitPrice * item.quantity,
        })),
      },
    },
    { upsert: true, new: true, session }
  );

  // Update YearlySales
  await YearlySales.findOneAndUpdate(
    { year: date.getFullYear() },
    {
      $inc: {
        totalSales: invoice.subTotal,
        invoiceCount: 1,
      },
      $push: {
        productSales: invoice.items.map((item) => ({
          productCode: item.code,
          quantity: item.quantity,
          revenue: item.unitPrice * item.quantity,
        })),
      },
    },
    { upsert: true, new: true, session }
  );
}
