import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send("Access denied");
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, user) => {
    if (error) {
      res.status(403).send("invalid token");
      return;
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
