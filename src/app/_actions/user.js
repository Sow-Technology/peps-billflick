"use server";

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function updateUser(user) {
  await dbConnect();
  try {
    const updatedUser = await User.findByIdAndUpdate(user._id, user);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return true;
  } catch (err) {
    throw new Error("Unable to update the user");
  }
}
