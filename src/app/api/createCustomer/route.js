import dbConnect from "@/lib/dbConnect";
import { Customer } from "@/models/Customer";

export async function POST(req) {
  await dbConnect();
  console.log(req);
  const reqBody = await req.json();

  console.log(reqBody);
  const { name, phoneNumber, emailId } = reqBody;
  if (!name || !phoneNumber || !emailId)
    return Response.error("All fields are required");
  const existingCustomer = Customer.findOne({
    phoneNumber,
  });
  if (existingCustomer) {
    return Response.json("Customer already exists");
  }
  const newCustomer = new Customer({
    name,
    phoneNumber,
    email: emailId,
  });
  const savedCustomer = newCustomer.save();
  return Response.json(savedCustomer);
}
