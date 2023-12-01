import mongoose, { Model } from "mongoose";
import { UserType } from "../interfaces/types/Types";

const userSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true, //every user has different username
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User: Model<UserType> =
  mongoose.models.User || mongoose.model("User", userSchema); //checking weather the schema user is already present
