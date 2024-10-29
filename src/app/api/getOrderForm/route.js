import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";

export async function GET(req) {
  await dbConnect();

  try {
    const invoices = await Invoice.find({
      paymentStatus: "Partially Paid",
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
export const dynamic = "force-dynamic";
