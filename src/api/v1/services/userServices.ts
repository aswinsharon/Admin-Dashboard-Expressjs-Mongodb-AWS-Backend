import { UserRenderType } from "../interfaces/types/Types";
import { User } from "../models/userSchema";

const getAllUsersService = async (): Promise<UserRenderType[]> => {
  try {
    const users = (await User.find().select("-password")) as UserRenderType[];
    return users;
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const addUserService = async (newUserObject: any) => {
  try {
    if (newUserObject) {
      const reponseForAdd = await User.create(newUserObject);
      return reponseForAdd;
    } else {
      console.log("empty object");
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

const deleteUserService = async (id: string) => {
  try {
    if (id) {
      const responseForDelete = await User.findByIdAndDelete(id);
      return responseForDelete;
    } else {
      throw new Error("Id is empty");
    }
  } catch (error: any) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
export default {
  getAllUsersService,
  addUserService,
  deleteUserService,
};
