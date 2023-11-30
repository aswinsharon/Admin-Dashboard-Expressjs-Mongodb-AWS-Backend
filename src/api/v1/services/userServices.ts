import { User } from "../models/userSchema";

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export default {
  getAllUsers,
};
