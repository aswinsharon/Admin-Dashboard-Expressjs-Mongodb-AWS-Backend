import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserAuthType, UserType } from "../interfaces/types/Types";
import { generateAccessToken, generateRefreshToken } from "../helpers/commonUtils";
import { User } from "../models/userSchema";
import { Constants } from "../../../config/constants";
import { AuthResponse } from "../models/authResponse";
import logger from "../../../config/Loggers";

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

/**
 * Handles user login.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response<any, Record<string, any>>>} Promise representing the result of the operation.
 */
const login = async (req: Request, res: Response) => {
  let foundUser: UserType | null;
  let response;
  const { username, password } = req.body;

  try {
    // Find the user in the database based on the provided username.
    foundUser = await User.findOne({ username: username });

    if (foundUser && foundUser?.username && foundUser?.password) {
      // Check if the provided password matches the stored hashed password.
      if (bcrypt.compareSync(password, foundUser.password)) {
        // Generate access and refresh tokens upon successful authentication.
        const accessToken = generateAccessToken(foundUser._id);
        const refreshToken = generateRefreshToken(foundUser._id);

        // Create an AuthResponse with success details.
        response = new AuthResponse(
          Constants.HTTP_OK_STATUS_CODE,
          Constants.AUTHORIZED,
          Constants.SUCCESS_MSG_AUTHORIZED_SUCCESSFULLY,
          accessToken,
          refreshToken
        );
      } else {
        // Return unauthorized response if the passwords don't match.
        response = new AuthResponse(
          Constants.HTTP_UNAUTHORIZED_STATUS_CODE,
          Constants.UNAUTHORIZED,
          Constants.ERROR_MSG_UNAUTHORIZED_USER
        );
      }
    } else {
      // Return forbidden response if the user is not found in the database.
      response = new AuthResponse(
        Constants.HTTP_FORBIDDEN_STATUS_CODE,
        Constants.FORBIDDEN,
        Constants.ERROR_MSG_FORBIDDEN_USER
      );
    }
  } catch (exception) {
    // Handle exceptions and log internal server error.
    logger.exception(Constants.ERROR_MSG_INTERNAL_SERVER_ERROR);
    response = new AuthResponse(
      Constants.HTTP_SERVER_ERROR_STATUS_CODE,
      Constants.INTERNAL_SERVER_ERROR,
      Constants.ERROR_MSG_INTERNAL_SERVER_ERROR
    );
  }
  // Return the response as a JSON object.
  return res.status(response.statusCode).json(response);
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
