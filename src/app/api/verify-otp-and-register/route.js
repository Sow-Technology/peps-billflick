import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyOTP } from "@/lib/otp";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password, otp } = await req.json();

    if (!email || !password || !otp) {
      return new Response(
        JSON.stringify({ message: "Email, password, and OTP are required" }),
        { status: 400 }
      );
    }

    if (!verifyOTP(email, otp)) {
      return new Response(
        JSON.stringify({ message: "Invalid OTP or OTP has expired" }),
        { status: 400 }
      );
    }

    const validDomain = "@sowtech.co.in";
    if (!email.endsWith(validDomain)) {
      return new Response(
        JSON.stringify({
          message: `Only emails ending with ${validDomain} are allowed`,
        }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ email: newUser.email }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
