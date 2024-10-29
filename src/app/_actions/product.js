"use server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function updateProduct(product) {
  await dbConnect();
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      product
    );
    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to update the product!");
  }
}

export async function createProduct(product) {
  await dbConnect();
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to create the product!");
  }
}

export async function deleteProduct(productid) {
  await dbConnect();
  console.log(productid);
  try {
    const deletedProduct = await Product.findByIdAndDelete(productid);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to delete the product!");
  }
}
