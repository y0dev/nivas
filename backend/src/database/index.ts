import mongoose from "mongoose";
import { UserModel } from "../api/components/user/user.model";
import { logger } from "../config/logger";

let database: mongoose.Connection;

export const connect = () => {
  // add your own uri below
  const uri = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/nivas' : 
    "mongodb+srv://<username>:<password>@cluster0-v6q0g.mongodb.net/test?retryWrites=true&w=majority";

  logger.info('Checking if connected to database');
  if (database) {
    return;
  }

  logger.info(`Attempting to connected to database on ${uri}`);
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  logger.info('Established a connection to database');
  database = mongoose.connection;

  database.once("open", async () => {
    logger.info('Connected to database');
  });

  database.on("error", () => {
    logger.error('Error connecting to database');
  });

  return {
    UserModel,
  };
};

export const disconnect = () => {
  if (!database) {
    return;
  }

  mongoose.disconnect();
};