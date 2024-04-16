import express from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Constants } from "../../../config/constants";
import { Response } from "../models/responseModel";

const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  let response: Response;
  const token = req.header("x-access-token");
  try {
    if (!token) {
      response = new Response(Constants.HTTP_UNAUTHORIZED_STATUS_CODE, "ACCESS_DENIED", "Access token required");
      res.status(Constants.HTTP_UNAUTHORIZED_STATUS_CODE).json(response);
      return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error: jwt.VerifyErrors | null, userId: string | jwt.JwtPayload | undefined) => {
      if (error) {
        response = new Response(Constants.HTTP_FORBIDDEN_STATUS_CODE, "INVALID_TOKEN", "Invalid token data");
        res.status(Constants.HTTP_FORBIDDEN_STATUS_CODE).json(response);
        return;
      } else {
        req.user = userId;
        next();
      }
    });
  } catch (exception) {
    if (exception instanceof TokenExpiredError) {
      response = new Response(Constants.HTTP_UNAUTHORIZED_STATUS_CODE, "TOKEN_EXPIRED", "Access token expired");
    } else if (exception instanceof JsonWebTokenError) {
      response = new Response(Constants.HTTP_UNAUTHORIZED_STATUS_CODE, "INVALID_TOKEN", "Invalid access token");
    } else {
      response = new Response(Constants.HTTP_SERVER_ERROR_STATUS_CODE, "INTERNAL_SERVER_ERROR", "Internal server error");
    }
    res.status(response.statusCode).json(response);
    return;
  };
}
export default authenticateToken;
