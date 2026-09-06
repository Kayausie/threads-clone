
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL not found");
  }

  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  } catch (error) {
    isConnected = false;
    throw error;
  }
};
