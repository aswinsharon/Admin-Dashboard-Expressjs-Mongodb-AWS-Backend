import { Request, Response } from "express";
import userServices from "../services/userServices";

import { UserRenderType } from "../interfaces/types/Types";
import {
  validateUserId,
  validateNewUserObjectFields,
  validateNewUserObjectValues,
} from "../helpers/validationHelpers";
import { User } from "../models/userSchema";
import { Constants } from "../../../config/constants";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const usersFromDB = await userServices.getAllUsersService();
    if (null !== usersFromDB) {
      const mappedUsers = usersFromDB.map((user: UserRenderType) => ({
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        img: user?.img,
        isActive: user?.isActive,
        isAdmin: user?.isAdmin,
        phone: user?.phone,
        address: user?.address,
      }));
      res.status(200).json(mappedUsers);
    } else {
      res.status(200).json([]);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req: Request, res: Response) => {
  let createUserResponseMessage = {
    statusCode: 0,
    message: "",
    userDetails: {} || null,
  };
  let errorMessage = {
    statusCode: 0,
    message: "",
  };
  try {
    let newUserObject = req.body;
    let userInsertionObject = {
      username: "",
      email: "",
      img: "",
      phone: "",
      password: "",
      address: "",
      isAdmin: false,
      isActive: false,
    };

    if (
      validateNewUserObjectFields(newUserObject) &&
      validateNewUserObjectValues(newUserObject)
    ) {
      userInsertionObject.username = newUserObject.username;
      userInsertionObject.password = newUserObject.password;
      userInsertionObject.email = newUserObject.email;
      userInsertionObject.address = newUserObject.address;
      userInsertionObject.phone = newUserObject.phone;
      userInsertionObject.img = newUserObject.img;

      const existingUser = await User.findOne({
        $or: [
          { username: userInsertionObject.username },
          { email: userInsertionObject.email },
        ],
      });
      if (existingUser) {
        errorMessage.message = "Username or email is already taken";
        errorMessage.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        return res.status(400).json(errorMessage);
      }
      if (newUserObject?.isAdmin === "yes") {
        userInsertionObject.isAdmin = true;
      }
      if (newUserObject?.isActive === "yes") {
        userInsertionObject.isActive = true;
      }

      const user = await userServices.addUserService(userInsertionObject);
      createUserResponseMessage.statusCode = Constants.HTTP_CREATED_STATUS_CODE;
      createUserResponseMessage.message = "User Created Successfully";
      createUserResponseMessage.userDetails = user;
      return res.status(201).json(createUserResponseMessage);
    } else {
      errorMessage.message = "Invalid Request";
      errorMessage.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      return res.status(400).json(errorMessage);
    }
  } catch (error) {
    errorMessage.message = "Internal Server Error";
    errorMessage.statusCode = Constants.HTTP_SERVER_ERROR_STATUS_CODE;
    return res.status(500).json(errorMessage);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  let deleteResponseMessage = {
    statusCode: 0,
    message: "",
  };
  try {
    const userId = req?.params?.userId;
    if (undefined !== userId) {
      if (validateUserId(userId)) {
        const deletedUser = await userServices.deleteUserService(userId);
        if (!deletedUser) {
          deleteResponseMessage.statusCode =
            Constants.HTTP_NOT_FOUND_STATUS_CODE;
          deleteResponseMessage.message = "User Not Found";
          return res
            .status(Constants.HTTP_NOT_FOUND_STATUS_CODE)
            .json(deleteResponseMessage);
        }
        return res.status(Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE).send();
      } else {
        deleteResponseMessage.statusCode =
          Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        deleteResponseMessage.message = "Invalid Request";
        return res
          .status(Constants.HTTP_BAD_REQUEST_STATUS_CODE)
          .json(deleteResponseMessage);
      }
    } else {
      deleteResponseMessage.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      deleteResponseMessage.message = "Invalid Request";
      return res
        .status(Constants.HTTP_BAD_REQUEST_STATUS_CODE)
        .json(deleteResponseMessage);
    }
  } catch (error) {
    deleteResponseMessage.statusCode = Constants.HTTP_SERVER_ERROR_STATUS_CODE;
    deleteResponseMessage.message = "Internal Server Error";
    return res
      .status(Constants.HTTP_SERVER_ERROR_STATUS_CODE)
      .json(deleteResponseMessage);
  }
};

export default {
  getUsers,
  createUser,
  deleteUser,
};
