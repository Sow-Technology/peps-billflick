import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return; // Check if already connected

  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default dbConnect;
