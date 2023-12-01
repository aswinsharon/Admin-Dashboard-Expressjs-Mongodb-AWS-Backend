import { UserType } from "../interfaces/types/Types";
import { User } from "../models/userSchema";

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const addUser = async (newUserObject: UserType) => {
  try {
    if (null !== newUserObject) {
      const reponseForAdd = await User.create(newUserObject);
      return reponseForAdd;
    } else {
      console.log("empty object");
      return null;
    }
  } catch (error: any) {
    throw new Error(`Error Adding users: ${error.message}`);
  }
};
export default {
  getAllUsers,
  addUser,
};
