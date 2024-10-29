import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response('Error retrieving products', { status: 500 });
  }
}

export async function POST(request) {
    try {
      await dbConnect();
      const productData = await request.json();
      
      // Log incoming data for debugging
      console.log('Incoming product data:', productData);
  
      // Ensure all required fields are provided
      if (!productData.productName || !productData.code || !productData.quantity) {
        return new Response('Missing required fields', { status: 400 });
      }
  
      const newProduct = new Product(productData);
      await newProduct.save();
      return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
      console.error('Error in POST request:', error);
      return new Response('Error creating product', { status: 500 });
    }
  }

export async function PUT(request) {
  try {
    await dbConnect();
    const { _id, ...updates } = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(_id, updates, { new: true });
    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new Response('Error updating product', { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { _id } = await request.json();
    await Product.findByIdAndDelete(_id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response('Error deleting product', { status: 500 });
  }
}
