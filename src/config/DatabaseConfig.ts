import mongoose, { ConnectOptions, Connection } from "mongoose";
import { EventEmitter } from "events";

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
      await mongoose.connect("mongodb://127.0.0.1:27017/dashboardDB", options);
      this.dbConnection = mongoose.connection;
      this.emit("connected", this.dbConnection);
    } catch (exception: any) {
      if (this.RETRY_COUNT <= this.MAX_COUNT) {
        console.error("connection unsucessful, retrying...", exception);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.connect();
      } else {
        this.RETRY_COUNT = 0;
        throw new Error(exception);
      }
    }
  };
  getDbConnection(): mongoose.Connection | null {
    return this.dbConnection;
  }
}

export default new DatabaseConfig();
