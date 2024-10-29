import dbConnect from "@/lib/dbConnect";
import { Customer } from "@/models/Customer";

export async function GET(req) {
  await dbConnect();
  const url = new URL(req.url);
  const phoneNumber = url.searchParams.get("phoneNumber");
  const response = await Customer.findOne({
    phoneNumber,
  }).lean();
  console.log(response);
  if (response !== null) return Response.json(response);
  return Response.json("Customer does not exist", response);
}
