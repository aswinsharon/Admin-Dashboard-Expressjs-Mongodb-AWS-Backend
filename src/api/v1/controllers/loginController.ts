import express from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserType } from "../interfaces/types/Types";
import { generateAccessToken, generateRefreshToken } from "../helpers/commonUtils";
import { User } from "../models/userSchema";
import { Constants } from "../../../config/constants";
import { Response } from "../models/responseModel";
import logger from "../../../config/Loggers";

/**
 * Handles user login.
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<express.Response<any, Record<string, any>>>} Promise representing the result of the operation.
 */
const login = async (req: express.Request, res: express.Response) => {
  let foundUser: UserType | null;
  let response: Response;
  const { username, password } = req?.body;

  try {
    // Find the user in the database based on the provided username.
    foundUser = await User.findOne({ username: username });

    if (foundUser && foundUser?.username && foundUser?.password && foundUser?._id) {
      // Check if the provided password matches the stored hashed password.
      if (bcrypt.compareSync(password, foundUser.password)) {
        // Generate access and refresh tokens upon successful authentication.
        const accessToken = generateAccessToken(foundUser._id);
        const refreshToken = generateRefreshToken(foundUser._id);

        res.cookie('accessToken', accessToken, { httpOnly: false, secure: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: true });

        response = new Response(
          Constants.HTTP_OK_STATUS_CODE,
          Constants.AUTHORIZED,
          Constants.SUCCESS_MSG_AUTHORIZED_SUCCESSFULLY,
        );
      } else {
        response = new Response(
          Constants.HTTP_UNAUTHORIZED_STATUS_CODE,
          Constants.UNAUTHORIZED,
          Constants.ERROR_MSG_UNAUTHORIZED_USER
        );
      }
    } else {
      response = new Response(
        Constants.HTTP_FORBIDDEN_STATUS_CODE,
        Constants.FORBIDDEN,
        Constants.ERROR_MSG_FORBIDDEN_USER
      );
    }
  } catch (exception) {
    logger.exception(Constants.ERROR_MSG_INTERNAL_SERVER_ERROR);
    response = new Response(
      Constants.HTTP_SERVER_ERROR_STATUS_CODE,
      Constants.INTERNAL_SERVER_ERROR,
      Constants.ERROR_MSG_INTERNAL_SERVER_ERROR
    );
  }
  return res.status(response.statusCode).json(response);
};

const refreshToken = (req: express.Request, res: express.Response): void => {
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
  login,
  refreshToken,
};
