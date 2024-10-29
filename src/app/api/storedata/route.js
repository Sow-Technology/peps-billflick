import { Invoice } from "@/models/Invoice";
import dbConnect from "@/lib/dbConnect"; // Ensure your db connection logic

export async function GET(req) {
  await dbConnect();

  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching invoices" }), {
      status: 500,
    });
  }
}

export const dynamic = "force-dynamic";
