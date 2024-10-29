// models/Counter.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the counter (e.g., "invoice")
  value: { type: Number, required: true }, // The current value of the counter
});

export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
