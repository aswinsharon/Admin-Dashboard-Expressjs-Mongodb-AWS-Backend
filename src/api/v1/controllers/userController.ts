import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userServices from "../services/userServices";
import { UserRenderType } from "../interfaces/types/Types";
import { validateUserId, validateNewUserObjectFields, validateNewUserObjectValues, } from "../helpers/validationHelpers";
import { User } from "../models/userSchema";
import { Constants } from "../../../config/constants";

/**
 * Retrieves all users from the database.
 * @param {Request} _req - Express request object (unused).
 * @param {Response} res - Express response object.
 * @returns {Promise<Response<any, Record<string, any>>>} Promise representing the result of the operation.
 */
const getUsers = async (_req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    // Retrieve all users from the database.
    const usersFromDB = await userServices.getAllUsersService();
    console.log(usersFromDB);

    // Check if users are present in the database.
    if (null !== usersFromDB) {
      // Map user data to a simplified format.
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
      return res.status(Constants.HTTP_OK_STATUS_CODE).json(mappedUsers);
    } else {
      // Return an empty array if no users are found.
      return res.status(Constants.HTTP_OK_STATUS_CODE).json([]);
    }
  } catch (error: any) {
    // Handle errors and return an appropriate response.
    return res.status(Constants.HTTP_SERVER_ERROR_STATUS_CODE).json({ error: error.message });
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
    invalidFields: [] as string[],
  };
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
  try {
    let newUserObject = req.body;
    if (validateNewUserObjectFields(newUserObject) && validateNewUserObjectValues(newUserObject)?.isValid) {
      const existingUser = await User.findOne({ $or: [{ username: newUserObject.username }, { email: newUserObject.email },], });
      if (existingUser) {
        errorMessage.message = "Username or email is already taken";
        errorMessage.statusCode = Constants.HTTP_CONFLICT_STATUS_CODE;
        return res.status(Constants.HTTP_CONFLICT_STATUS_CODE).json(errorMessage);
      } else {
        const hashedPassword = await bcrypt.hash(newUserObject.password, 10);
        userInsertionObject.username = newUserObject.username;
        userInsertionObject.password = hashedPassword;
        userInsertionObject.email = newUserObject.email;
        userInsertionObject.address = newUserObject.address;
        userInsertionObject.phone = newUserObject.phone;
        userInsertionObject.img = newUserObject.img;
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
        return res.status(Constants.HTTP_CREATED_STATUS_CODE).json(createUserResponseMessage);
      }
    } else {
      errorMessage.message = "Invalid Request";
      errorMessage.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      errorMessage.invalidFields = validateNewUserObjectValues(newUserObject).invalidFields;
      return res.status(Constants.HTTP_BAD_REQUEST_STATUS_CODE).json(errorMessage);
    }
  } catch (error) {
    console.log("under catch");
    errorMessage.message = "Internal Server Error";
    errorMessage.statusCode = Constants.HTTP_SERVER_ERROR_STATUS_CODE;
    return res.status(Constants.HTTP_SERVER_ERROR_STATUS_CODE).json(errorMessage);
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
