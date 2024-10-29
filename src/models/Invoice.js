import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    items: {
      type: [],
      ref: "Product",
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    taxValue: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    coupon: {
      type: String,
    },
    couponDiscount: {
      type: String,
    },
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
    storeName: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "cash",
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
    orderExpenses: { type: Number },
    profit: {
      type: Number,
    },
    aspire15: {
      type: Number,
    },
    clientSource: {
      type: String,
      enum: [
        "Phone Outreach",
        "Website",
        "Email Campaign",
        "Advertisement",
        "Referral",
        "Social Media",
        "Networking",
        "LinkedIn",
        "Affiliate",
        "WalkIn",
        "Other",
      ],
      default: "WalkIn",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Partially Paid", "Unpaid"],
      default: "Unpaid",
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
