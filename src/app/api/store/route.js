import dbConnect from "@/lib/dbConnect";
import { Store } from "@/models/store";
import mongoose from "mongoose";

// GET request
export async function GET() {
  try {
    await dbConnect();
    const products = await Store.find({});
    return Response.json(products);
  } catch (error) {
    console.error("Error in GET request:", error);
    return Response.json("Error retrieving products", { status: 500 });
  }
}

// POST request
export async function POST(request) {
  try {
    await dbConnect();
    const productData = await request.json();

    // Log incoming data for debugging
    console.log("Incoming product data:", productData);

    // Ensure all  requiredfields are provided
    if (
      !productData.code ||
      !productData.storeName ||
      !productData.phoneNumber
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newProduct = new Store(productData);
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

    const updatedProduct = await Store.findByIdAndUpdate(_id, updates, {
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

    const deletedProduct = await Store.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return new Response("Product not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new Response("Error deleting product", { status: 500 });
  }
}
