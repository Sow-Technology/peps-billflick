import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function GET(req, res) {
  try {
    await dbConnect();
    const products = await Product.find();
    console.log(products);

    return Response.json({ success: true, data: products });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error", error });
  }
}
export const dynamic = "force-dynamic";
