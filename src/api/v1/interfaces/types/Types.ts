import { Document } from "mongoose";

export interface UserType extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  img?: string;
  isActive: boolean;
  isAdmin: boolean;
  phone: string;
  address: string;
}
