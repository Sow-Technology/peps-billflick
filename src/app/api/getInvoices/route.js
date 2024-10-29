import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const fromDate = new Date(searchParams.get("from"));
  const toDate = new Date(searchParams.get("to"));
  toDate.setHours(23, 59, 59, 999);

  const storeName = searchParams.get("storeName");
  console.log(storeName);

  try {
    const invoices = await Invoice.find({
      createdAt: { $gte: fromDate, $lte: toDate },
      ...(storeName && storeName !== "all" ? { storeName } : {}),
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return Response.json(invoices);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching invoices" }, { status: 500 });
  }
}
