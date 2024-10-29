import dbConnect from '@/lib/dbConnect';
import { Invoice } from '@/models/Invoice';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const storeName = searchParams.get('storeName');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  await dbConnect();

  const query = {};
  if (storeName) {
    query.storeName = storeName;
  }
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  // Fetch all invoices for the store
  const invoices = await Invoice.find(query);

  // Calculate No. of Orders (total entries for a particular store)
  const numOfOrders = invoices.length;

  // Calculate Store Sale (sum of all `amountPaid`)
  const storeSale = invoices.reduce((total, invoice) => total + invoice.amountPaid, 0);

  // Calculate No. of Unique Customers (based on `customerName`)
  const uniqueCustomers = [...new Set(invoices.map(invoice => invoice.customerName))];
  const numOfCustomers = uniqueCustomers.length;

  // Calculate No. of Repeated Customers (customers with more than one entry)
  const repeatedCustomers = uniqueCustomers.filter(customer => 
    invoices.filter(invoice => invoice.customerName === customer).length > 1
  );
  const numOfRepeatedCustomers = repeatedCustomers.length;

  return new Response(
    JSON.stringify({
      numOfOrders,
      storeSale,
      numOfCustomers,
      numOfRepeatedCustomers
    }), 
    { status: 200 }
  );
}
