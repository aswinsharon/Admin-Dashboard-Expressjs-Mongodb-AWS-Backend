import express from "express";
import cors from "cors";
import { connectToDB } from "./config/DatabaseConfig";
import userRoutes from "./api/v1/routes/userRouter";

const app = express();
const PORT = 8081;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api/v1", userRoutes);

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
