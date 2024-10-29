import { NextResponse } from "next/server";
// import { connectToDatabase } from '../../../../lib/db';
// import User from '../../../../models/User';
// import { generateOTP, sendOTP, storeOTP } from '../../../../lib/otp';

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { generateOTP, sendOTP, storeOTP } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const otp = generateOTP();
    await sendOTP(email, otp);

    storeOTP(email, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
