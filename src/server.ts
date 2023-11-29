import express from "express";
import { connectToDB } from "./config/DatabaseConfig";
const app = express();
const PORT = 8081;

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
