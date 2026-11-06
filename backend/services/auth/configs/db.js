import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("Connected db");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    throw err;
  }
};
