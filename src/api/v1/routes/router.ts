import express from "express";
import loginController from "../controllers/loginController";
import userController from "../controllers/userController";
import authenticateToken from "../middlewares/authMiddleWare";
import transactionController from "../controllers/transactionController"
const router = express.Router();

router.post("/login", loginController.login);
router.post("/refresh-token", loginController.refreshToken);

router.get("/transactions", transactionController.getTransactionData);

router.use(authenticateToken);

router.get("/users", userController.getUsers);
router.post("/users/add", userController.createUser);
router.delete("/users/:userId", userController.deleteUser);


export default router;
