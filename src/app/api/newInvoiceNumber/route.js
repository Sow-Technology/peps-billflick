import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Check for the latest invoice
    const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });

    let nextInvoiceNumber;

    if (latestInvoice) {
      // Extract the numerical part of the latest invoice number and increment it
      const lastInvoiceNumber = latestInvoice.orderNumber;
      const lastInvoiceValue = parseInt(lastInvoiceNumber.replace(/\D/g, "")); // Extract only the number part

      nextInvoiceNumber = "JO" + (lastInvoiceValue + 1);
    } else {
      nextInvoiceNumber = "JO1";
    }

    return NextResponse.json(nextInvoiceNumber);
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { error: "Unable to generate invoice number" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
