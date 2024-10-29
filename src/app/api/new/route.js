import { User } from "@/models/User"; // Ensure the path is correct
import dbConnect from "@/lib/dbConnect"; // Ensure this utility is properly set up

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the user data from the request body
    const { email, password, role, isApproved, storeAccess } = await req.json();

    // Create a new user
    const newUser = new User({
      email,
      password,
      role,
      isApproved,
      storeAccess,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return a success response
    return new Response(JSON.stringify(savedUser), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
