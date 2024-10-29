"use server";

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// Fetch user by email
export async function getUserByEmail(email) {
  await dbConnect();
  const existingUser = await User.findOne({ email }).select("+password"); // Ensure to select the password field
  if (!existingUser) return null;

  return existingUser; // Return the Mongoose document
}

// Handle email sign-in or sign-up
export async function handleEmailSignIn(email, password) {
  await dbConnect();

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return existingUser;

  // Hash the password before saving
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Check if this is the first user in the database
  const userCount = await User.countDocuments();

  // Create a new user with the appropriate role
  const newUser = new User({
    email,
    password: hashedPassword, // Store the hashed password
    role: userCount === 0 ? "superAdmin" : "user", // Assign "superUser" if no users exist
  });

  const savedUser = await newUser.save();
  return savedUser;
}
