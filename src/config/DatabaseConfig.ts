import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017");
  } catch (error: any) {
    throw new Error(error);
  }
};

export default { connectToDB };
