import dbConnect from "@/lib/dbConnect";
import { Store } from "@/models/store";

export async function GET() {
  try {
    await dbConnect();
    const stores = await Store.find({}).lean();
    return Response.json(stores);
  } catch (error) {
    console.error("Error in GET request:", error);
    return Response.json("Error retrieving products", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
