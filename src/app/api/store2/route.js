// src/pages/api/stores.js
import dbConnect from '@/lib/dbConnect';
import { Invoice } from '@/models/Invoice';

export async function GET() {
  await dbConnect();

  try {
    const storeNames = await Invoice.distinct('storeName');
    return new Response(
      JSON.stringify({ storeNames }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch store names:', error);
    return new Response('Error fetching store names', { status: 500 });
  }
}
