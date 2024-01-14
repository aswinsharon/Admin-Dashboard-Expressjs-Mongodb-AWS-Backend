import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Constants } from "../../../config/constants";

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let authenticationResponse = {
    statusCode: 0,
    message: "",
  };
  const token = req.header("x-access-token");
  if (!token) {
    authenticationResponse.statusCode = Constants.HTTP_UNAUTHORIZED_STATUS_CODE;
    authenticationResponse.message = "Access denied";
    res.status(Constants.HTTP_UNAUTHORIZED_STATUS_CODE).json(authenticationResponse);
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, userId) => {
    if (error) {
      console.log("error", error);
      authenticationResponse.statusCode = Constants.HTTP_FORBIDDEN_STATUS_CODE;
      authenticationResponse.message = "Invalid Token";
      res.status(Constants.HTTP_FORBIDDEN_STATUS_CODE).json(authenticationResponse);
      return;
    } else {
      req.user = userId;
      next();
    }
  });
};

export default authenticateToken;
