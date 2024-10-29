import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
// import { connectToDatabase } from '../../../../lib/db';
// import User from '../../../../models/User';
// import { verifyOTP } from '../../../../lib/otp';

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyOTP } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const isOtpValid = verifyOTP(email, otp);
    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne({ email }, { password: hashedPassword });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
