import dbConnect from "@/lib/dbConnect";
import { Coupon } from "@/models/Coupon";
import mongoose from "mongoose";

// GET request
export async function GET(request) {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).lean();
    return Response.json(coupons);
  } catch (error) {
    return Response.json("Error retrieving coupons", { status: 500 });
  }
}

// POST request
export async function POST(request) {
  try {
    await dbConnect();
    const productData = await request.json();

    // Log incoming data for debugging
    console.log("Incoming product data:", productData);

    // Ensure all required fields are provided
    if (
      !productData.couponCode ||
      !productData.discount ||
      !productData.validity
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newProduct = new Coupon(productData);
    await newProduct.save();
    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Error creating product", { status: 500 });
  }
}

// PUT request
export async function PUT(request) {
  try {
    await dbConnect();
    const { _id, ...updates } = await request.json();

    // Ensure the _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return new Response("Invalid ID format", { status: 400 });
    }

    const updatedProduct = await Coupon.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response("Error updating product", { status: 500 });
  }
}

// DELETE request
export async function DELETE(request) {
  try {
    await dbConnect();
    const { _id } = await request.json();

    // Ensure the _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return new Response("Invalid ID format", { status: 400 });
    }

    const deletedProduct = await Coupon.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return new Response("Product not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new Response("Error deleting product", { status: 500 });
  }
}
