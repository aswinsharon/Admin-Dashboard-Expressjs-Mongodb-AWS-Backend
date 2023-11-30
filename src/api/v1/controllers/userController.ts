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

export default {
  getUsers,
};
