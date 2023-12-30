import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/userSchema";
// import { Constants } from "../../../config/constants";

const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are empty" });
  }

  try {
    const foundUser = await User.findOne({ username: username });
    console.log("foundUser", foundUser);
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      return res.json({ success: "User exists" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { handleLogin };
