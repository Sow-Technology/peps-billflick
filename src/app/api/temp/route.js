import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { Counter } from "@/models/Counter";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    // Find the highest invoice number currently in the database
    const latestInvoice = await Invoice.findOne()
      .sort({ createdAt: -1 })
      .select("orderNumber");

    let highestInvoiceNumber = 0;

    if (latestInvoice) {
      // Extract the numeric part from the existing invoice number
      const invoiceNumberString = latestInvoice.orderNumber.replace("JO", "");
      highestInvoiceNumber = parseInt(invoiceNumberString, 10);
    }

    // Update the Counter if needed
    await Counter.findOneAndUpdate(
      { name: "invoice" },
      { $set: { value: highestInvoiceNumber } }, // Initialize counter to the highest existing number
      { upsert: true } // Create the counter if it doesn't exist
    );

    return NextResponse.json({
      message: "Counter initialized to highest invoice number",
    });
  } catch (error) {
    console.error("Error initializing counter:", error);
    return NextResponse.json(
      { error: "Unable to initialize counter" },
      { status: 500 }
    );
  }
}
