import mongoose, { ConnectOptions, Connection } from "mongoose";
import { EventEmitter } from "events";

const MONGO_URI = process.env.MONGO_URI as string;

class DatabaseConfig extends EventEmitter {
  RETRY_COUNT = 1;
  MAX_COUNT = 3;

  private dbConnection: Connection | null = null;

  connect = async (): Promise<void> => {
    const options: ConnectOptions = {
      autoIndex: false,
      maxPoolSize: 10,
      connectTimeoutMS: 2000,
    };
    try {
      await mongoose.connect(MONGO_URI, options);
      this.dbConnection = mongoose.connection;
      this.emit("connected", this.dbConnection);
    } catch (error: any) {
      if (this.isNetworkError(error) && this.RETRY_COUNT <= this.MAX_COUNT) {
        console.error(`Network error occurred, retrying for ${this.RETRY_COUNT} time`, error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        this.RETRY_COUNT++;
        await this.connect();
      } else {
        console.error("Maximum retries reached or non-network error, closing connection", error);
        await this.closeConnection();
        process.exit();
      }
    }
  };

  private isNetworkError(error: any): boolean {
    return error?.code === "ETIMEOUT";
  }

  private async closeConnection(): Promise<void> {
    if (this.dbConnection) {
      await this.dbConnection.close();
      this.dbConnection = null;
    }
  }

  getDbConnection(): mongoose.Connection | null {
    return this.dbConnection;
  }
}

export default new DatabaseConfig();
