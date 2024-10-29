import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({
      success: false,
      message: "Missing startDate or endDate query parameters",
    });
  }

  try {
    const dailySales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$subTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log(dailySales);

    return NextResponse.json({ success: true, data: dailySales });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch daily sales data",
    });
  }
}
