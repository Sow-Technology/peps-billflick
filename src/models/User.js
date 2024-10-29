import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["superAdmin", "coSuperAdmin", "admin", "user"],
      default: "user",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    storeAccess: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
