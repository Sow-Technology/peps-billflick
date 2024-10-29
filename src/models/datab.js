import mongoose from 'mongoose';

// Define the schema for an individual item in the invoice
const ProductSchema = new mongoose.Schema({
  code: { type: String, required: true }, // Reference to the product code
  quantity: { type: Number, required: true, default: 1 },
  productName: { type: String, required: true }, 
  price: { type: Number, required: true }, // Price per item, fetched or set based on the product code
});

// Define the main schema for the invoice
const InvoiceSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  items: [ProductSchema], // Array of items
  amountPaid: { type: Number, required: true, default: 0 },
  subTotal: { type: Number, required: true, default: 0 },
  notes: { type: String, maxLength: 500 },
  paymentMode: { 
    type: String, 
    enum: ['cash', 'upi', 'card'], 
    default: 'cash' 
  },
  isPaymentDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoicee || mongoose.model('Invoicee', InvoiceSchema);
