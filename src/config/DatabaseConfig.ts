import mongoose, { ConnectOptions, Connection } from "mongoose";
import { EventEmitter } from "events";
const MONGO_URI = process.env.MONGO_URI as string;

class DatabaseConfig extends EventEmitter {
  RETRY_COUNT = 0;
  MAX_COUNT = 3;

  private dbConnection: Connection | null = null;

  connect = async (): Promise<void> => {
    const options: ConnectOptions = {
      autoIndex: false,
      maxPoolSize: 10,
    };
    try {
      await mongoose.connect(MONGO_URI, options);
      this.dbConnection = mongoose.connection;
      this.emit("connected", this.dbConnection);
    } catch (exception: any) {
      if (this.RETRY_COUNT < this.MAX_COUNT) {
        console.error("connection unsucessful, retrying...", exception);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.connect();
      } else {
        this.RETRY_COUNT = 0;
        console.error("Maximum retries reached closing connection");
        await this.closeConnection();
        process.exit();
      }
    }
  };

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
