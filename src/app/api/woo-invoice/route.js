import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { Invoice } from "@/models/Invoice";

// Helper function to map WooCommerce order to Invoice
function mapWooCommerceOrderToInvoice(wcOrder) {
  const lineItems = wcOrder.line_items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price),
    total: parseFloat(item.total),
  }));

  return {
    orderNumber: wcOrder.number,
    customerName: `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}`,
    phoneNumber: wcOrder.billing.phone || "",
    emailId: wcOrder.billing.email,
    items: lineItems,
    amountPaid: parseFloat(wcOrder.total),
    subTotal: parseFloat(wcOrder.total) - parseFloat(wcOrder.total_tax),
    taxValue: parseFloat(wcOrder.total_tax),
    tax: parseFloat(wcOrder.total_tax),
    coupon: wcOrder.coupon_lines.length > 0 ? wcOrder.coupon_lines[0].code : "",
    couponDiscount:
      wcOrder.coupon_lines.length > 0 ? wcOrder.coupon_lines[0].discount : "0",
    storeName: "WooCommerce Store", // Set this to your store name
    paymentMode: wcOrder.payment_method === "cod" ? "cash" : "card", // Adjust as needed
    isPaymentDone: wcOrder.status === "completed",
    paymentStatus: wcOrder.status === "completed" ? "Paid" : "Unpaid",
    balance: 0, // Calculate based on your business logic
    clientSource: "Website",
    notes: wcOrder.customer_note || "",
  };
}

export async function POST(req) {
  console.log("Webhook received");

  // Connect to the database
  await dbConnect();

  // Get the raw body as a string
  const rawBody = await req.text();
  console.log("Raw body:", rawBody);

  // Parse the body as JSON
  let wcOrder;
  try {
    wcOrder = JSON.parse(rawBody);
    console.log("Parsed body:", wcOrder);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  // Verify the webhook signature
  const signature = req.headers.get("x-wc-webhook-signature");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(rawBody)
    .digest("base64");

  if (signature !== expectedSignature) {
    console.log("Invalid signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  try {
    const invoiceData = mapWooCommerceOrderToInvoice(wcOrder);

    // Check if an invoice with this order number already exists
    let invoice = await Invoice.findOne({
      orderNumber: invoiceData.orderNumber,
    });

    if (invoice) {
      // Update existing invoice
      Object.assign(invoice, invoiceData);
      await invoice.save();
      console.log("Invoice updated:", invoice._id);
    } else {
      // Create new invoice
      invoice = new Invoice(invoiceData);
      await invoice.save();
      console.log("New invoice saved:", invoice._id);
    }

    return NextResponse.json({
      message: "Invoice processed successfully",
      invoiceId: invoice._id,
    });
  } catch (error) {
    console.error("Error processing invoice:", error);
    return NextResponse.json(
      { message: "Error processing invoice", error: error.message },
      { status: 500 }
    );
  }
}
