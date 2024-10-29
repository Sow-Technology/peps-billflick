import { NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/lib/dbConnect";

// Connect to the database
await dbConnect();

// GET all users (accessible only to superusers)
export async function GET(req) {
  const roleHeader = req.headers.get("role");

  // if (roleHeader !== 'superuser') {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const users = await User.find();
    return NextResponse.json({ users }); // Return an array in an object
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT request to update user's role or storeAccess
export async function PUT(req) {
  const isSuperuser = req.headers.get("superuser"); // Indicating whether the request comes from a superuser
  if (!isSuperuser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role, storeAccess } = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: role || undefined,
        storeAccess: storeAccess || undefined,
      },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
