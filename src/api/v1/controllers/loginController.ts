import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserAuthType, UserType } from "../interfaces/types/Types";
import { generateAccessToken, generateRefreshToken } from "../helpers/commonUtils";
import { User } from "../models/userSchema";
import { Constants } from "../../../config/constants";
import { AuthResponse } from "../models/authResponse";

const users: UserAuthType[] = [];

const register = (req: Request, res: Response): void => {
  // let response = {
  //   statusCode: 0,
  //   status: '',
  //   message: ''
  // }
  try {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user: UserAuthType = {
      id: Date.now().toString(),
      username: username,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send("User registered successfully.");
    return;
  } catch (exception) {
    res.status(500).json
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  let foundUser: UserType | null;
  let response;
  const { username, password } = req.body;
  try {
    foundUser = await User.findOne({ username: username });
    if (foundUser && foundUser.username && foundUser.password) {
      if (bcrypt.compareSync(password, foundUser.password)) {
        const accessToken = generateAccessToken(foundUser._id);
        const refreshToken = generateRefreshToken(foundUser._id);
        response = new AuthResponse(Constants.HTTP_OK_STATUS_CODE, "AUTHORIZED", "User authorized successfully", accessToken, refreshToken);
        res.status(200).json(response);
        return;
      } else {
        response = new AuthResponse(Constants.HTTP_UNAUTHORIZED_STATUS_CODE, "UNAUTHORIZED", "Unauthorized user");
        res.status(401).json(response);
        return;
      }
    } else {
      response = new AuthResponse(Constants.HTTP_FORBIDDEN_STATUS_CODE, "FORBIDDEN", "User not found or forbidden");
      res.status(403).json(response);
      return;
    }
  } catch (error) {
    console.error("Error during login:", error);
    response = new AuthResponse(Constants.HTTP_SERVER_ERROR_STATUS_CODE, "INTERNAL_SERVER_ERROR", "Internal Server Error");
    res.status(Constants.HTTP_SERVER_ERROR_STATUS_CODE).json(response);
  }
};

const refreshToken = (req: Request, res: Response): void => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.status(401).send("Refresh token not provided.");
    return;
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      res.status(403).send("Invalid refresh token.");
      return;
    }
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  }
  );
};

export default {
  register,
  login,
  refreshToken,
};
