import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/users", userController.getUsers);

router.post("/users/add", userController.createUser);

router.delete("/users/:userId", userController.deleteUser);

export default router;
