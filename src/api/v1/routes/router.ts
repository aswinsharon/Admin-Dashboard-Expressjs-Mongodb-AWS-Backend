import express from "express";
import loginController from "../controllers/loginController";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/login", loginController.handleLogin);

router.get("/users", userController.getUsers);

router.post("/users/add", userController.createUser);

router.delete("/users/:userId", userController.deleteUser);

export default router;
