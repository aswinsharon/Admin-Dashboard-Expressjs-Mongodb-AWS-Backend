import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any): string => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
};
