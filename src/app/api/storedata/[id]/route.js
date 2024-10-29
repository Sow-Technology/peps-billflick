import { Invoice } from "@/models/Invoice";
import  dbConnect  from "@/lib/dbConnect";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const { orderExpenses } = await req.json();

  // Update the invoice with the new orderExpenses
  const updatedInvoice = await Invoice.findByIdAndUpdate(
    id,
    { orderExpenses },
    { new: true }
  );

  if (!updatedInvoice) {
    return new Response(JSON.stringify({ error: "Invoice not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(updatedInvoice), { status: 200 });
}
