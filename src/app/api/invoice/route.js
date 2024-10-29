import { updateAggregatedData } from "@/app/_actions/analytics";
import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";
import mongoose from "mongoose";

// POST method to create an invoice
export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  console.log("Received body:", body);

  if (
    !body.orderNumber ||
    !body.customerName ||
    !body.phoneNumber ||
    !body.emailId
  ) {
    return new Response(
      JSON.stringify({ success: false, message: "Missing required fields" }),
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newInvoice = new Invoice({
      ...body,
    });

    // Save the invoice to the database
    const savedInvoice = await newInvoice.save({ session });

    // Update aggregated data
    await updateAggregatedData(savedInvoice, session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Data saved and aggregated");
    return new Response(JSON.stringify({ success: true, data: savedInvoice }), {
      status: 201,
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error saving invoice:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to save invoice" }),
      { status: 400 }
    );
  }
}

// DELETE method to remove an invoice
export async function DELETE(req) {
  await dbConnect();

  const { orderNumber } = await req.json(); // Expecting orderNumber to be sent in the request body

  console.log("Received DELETE request for orderNumber:", orderNumber);

  if (!orderNumber) {
    return new Response(
      JSON.stringify({ success: false, message: "Missing orderNumber" }),
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find and delete the invoice
    const deletedInvoice = await Invoice.findOneAndDelete(
      { orderNumber },
      { session }
    );

    if (!deletedInvoice) {
      return new Response(
        JSON.stringify({ success: false, message: "Invoice not found" }),
        { status: 404 }
      );
    }

    // Update aggregated data after deletion if needed
    await updateAggregatedData(deletedInvoice, session); // If needed, adjust this logic based on your aggregation needs

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Invoice deleted successfully");
    return new Response(
      JSON.stringify({ success: true, data: deletedInvoice }),
      {
        status: 200,
      }
    );
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting invoice:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to delete invoice" }),
      { status: 400 }
    );
  }
}
