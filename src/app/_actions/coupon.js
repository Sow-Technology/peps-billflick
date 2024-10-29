"use server";

import dbConnect from "@/lib/dbConnect";
import { Coupon } from "@/models/Coupon";

export async function createCoupon(data) {
  await dbConnect();
  try {
    console.log("data", data);
    const existingCoupon = await Coupon.findOne({ couponCode: data.code });
    console.log(existingCoupon);
    if (existingCoupon) {
      console.log("Already exxitss======s");
      console.log("exx", existingCoupon);
      throw new Error("Coupon already exists with this code.");
    }

    const newCoupon = new Coupon({
      ...data,
    });

    const savedCoupon = await newCoupon.save();
    console.log(savedCoupon);
    return {
      success: true,
      message: "Coupon created successfully",
    };
  } catch (err) {
    console.log(err);
    if (err.message.includes("Coupon already exists")) {
      console.log("Already exxitss======s");
      return {
        success: false,
        message: "A coupon with this code already exists",
      };
    }
    return {
      success: false,
      message: "An error occurred while creating the coupon",
    };
  }
}

export async function getCouponDetails(couponCode) {
  try {
    await dbConnect();

    const coupon = await Coupon.findOne({ couponCode }).lean();
    coupon._id = undefined;
    if (!coupon) {
      throw new Error(`Coupon with code ${couponCode} not found.`);
    }

    console.log("Coupon details retrieved successfully:", coupon);
    return { success: true, data: coupon };
  } catch (error) {
    console.error("Error fetching coupon details:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateCoupon(coupon) {
  await dbConnect();
  try {
    await Coupon.findByIdAndUpdate(coupon._id, coupon);
    return true;
  } catch (err) {
    throw new Error("Internal server error!, unable to update coupon");
  }
}

export async function deleteCoupon(couponid) {
  await dbConnect();

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(couponid);
    if (!deletedCoupon) {
      throw new Error("Coupon not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to delete the Coupon");
  }
}
