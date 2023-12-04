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
    if (null !== newUserObject) {
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

const deleteUserService = async (Id: string) => {
  try {
    const responseForDelete = await User.findByIdAndDelete(Id);
    return responseForDelete;
  } catch (error: any) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
export default {
  getAllUsersService,
  addUserService,
  deleteUserService,
};
