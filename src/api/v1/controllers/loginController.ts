import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserAuthType } from "../interfaces/types/Types";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/commonUtils";

const users: UserAuthType[] = [];

const register = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user: UserAuthType = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
  };
  users.push(user);

  res.status(201).send("User registered successfully.");
};

const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).send("Invalid username or password.");
    return;
  }

  const accessToken = generateAccessToken({ username: user.username });
  const refreshToken = generateRefreshToken({ username: user.username });

  res.json({ accessToken, refreshToken });
};

const refreshToken = (req: Request, res: Response): void => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.status(401).send("Refresh token not provided.");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, user: any) => {
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
