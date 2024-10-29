"use server";

import dbConnect from "@/lib/dbConnect";
import { Store } from "@/models/store";

export async function createStore(storeData) {
  await dbConnect();
  try {
    const newStore = new Store({
      code: storeData.code,
      storeName: storeData.storeName,
      phoneNumber: storeData.phoneNumber,
      address: storeData.address,
      logo: storeData.logo,
    });
    await newStore.save();
    console.log("Store created successfully");
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to create the store!");
  }
}

export async function updateStore(store) {
  await dbConnect();

  try {
    const updatedStore = await Store.findByIdAndUpdate(store._id, store);
    if (!updatedStore) {
      throw new Error("Product not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to update the store");
  }
}

export async function deleteStore(storeid) {
  await dbConnect();

  try {
    const deletedStore = await Store.findByIdAndDelete(storeid);
    if (!deletedStore) {
      throw new Error("Product not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to delete the store");
  }
}
