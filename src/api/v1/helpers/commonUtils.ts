import jwt from "jsonwebtoken";

export const generateAccessToken = (id: any): string => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = (id: any): string => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!);
};
