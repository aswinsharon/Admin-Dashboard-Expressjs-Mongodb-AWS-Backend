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
    const newUserObject = req?.body;
    if (null !== newUserObject) {
      console.log(newUserObject);
      const user = await userServices.addUser(newUserObject);
      res
        .json(201)
        .json({ message: "user added successfully to the database" });
      console.log(user);
    } else {
      console.log("the user object is empty");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getUsers,
  createUser,
};
