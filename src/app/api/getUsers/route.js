import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}).lean();
    return Response.json(users);
  } catch (err) {
    return Response.json("Unable to fetch users", {
      status: 500,
    });
  }
}
