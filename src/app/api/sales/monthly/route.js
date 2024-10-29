import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const year = url.searchParams.get("year");

  if (!year) {
    return NextResponse.json({
      success: false,
      message: "Missing year query parameter",
    });
  }

  const monthlySales = await Invoice.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%m", date: "$createdAt" } },
        totalSales: { $sum: "$subTotal" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({ success: true, data: monthlySales });
}
