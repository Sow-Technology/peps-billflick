// pages/api/sales/top-products.js
import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const topSellingProducts = await Invoice.aggregate([
      { $match: { isPaymentDone: true, amountPaid: { $gt: 0 } } }, // Only consider completed sales
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.code", // Use 'code' instead of 'productId'
          productName: { $first: "$items.productName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.unitPrice", "$items.quantity"] },
          },
        },
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    console.log(
      "API - Top Selling Products:",
      JSON.stringify(topSellingProducts, null, 2)
    );

    return NextResponse.json({ success: true, data: topSellingProducts });
  } catch (error) {
    console.error("API Error - Top Selling Products:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch top selling products",
      error: error.message,
    });
  }
}
