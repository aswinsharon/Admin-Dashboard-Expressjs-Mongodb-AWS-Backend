import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import databaseConfig from "./config/DatabaseConfig";
import router from "./api/v1/routes/router";

const app = express();
const PORT = 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api/v1", router);

databaseConfig.on("connected", (_dbConnection) => {
  console.log("Event received: MongoDB connected successfully!");
});

const startServer = async () => {
  await databaseConfig.connect();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

process.on("SIGINT", async () => {
  console.log("\nClosing MongoDB connection...");
  const dbConnection = databaseConfig.getDbConnection();
  if (dbConnection) {
    await dbConnection.close();
  }
  process.exit();
});

(async () => {
  await startServer();
})();

exports.handler = serverless(app);
