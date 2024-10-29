import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const startYear = url.searchParams.get("startYear");
  const endYear = url.searchParams.get("endYear");

  if (!startYear || !endYear) {
    return NextResponse.json({
      success: false,
      message: "Missing startYear or endYear query parameters",
    });
  }

  try {
    const yearlySales = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${startYear}-01-01`),
            $lte: new Date(`${endYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
          totalSales: { $sum: "$subTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({ success: true, data: yearlySales });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch yearly sales data",
      error: error.message,
    });
  }
}
