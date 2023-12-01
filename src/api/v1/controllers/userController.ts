import { Request, Response } from "express";
import userServices from "../services/userServices";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    let newUserObject = req?.body;
    let userInsertionObject = {
      username: "",
      email: "",
      img: "",
      phone: "",
      password: "",
      address: "",
      isAdmin: false,
      isActive: false,
    };
    if (null !== newUserObject) {
      if (
        newUserObject?.username &&
        newUserObject?.email &&
        newUserObject?.isAdmin &&
        newUserObject?.isActive &&
        newUserObject?.password &&
        newUserObject?.address &&
        newUserObject?.phone &&
        newUserObject?.img
      ) {
        if (newUserObject.isAdmin === "yes") {
          userInsertionObject.isAdmin = true;
        }
        if (newUserObject.active === "yes") {
          userInsertionObject.isActive = true;
        }
        userInsertionObject.username = newUserObject.username;
        userInsertionObject.password = newUserObject.password;
        userInsertionObject.email = newUserObject.email;
        userInsertionObject.address = newUserObject.address;
        userInsertionObject.phone = newUserObject.phone;
        userInsertionObject.img = newUserObject.img;
        console.log(userInsertionObject);

        const user = await userServices.addUser(userInsertionObject);
        res
          .status(201)
          .json({ message: "user added successfully to the database" });
        console.log(user);
      } else {
        console.log("Invalid fields");
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      console.log("the user object is empty");
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.params?.userId;
    console.log("user id", userId);
    const deletedUser = await userServices.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getUsers,
  createUser,
  deleteUser,
};
