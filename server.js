const mongoose = require("mongoose");
const logger = require("./utils/logger").logger;
const UtilityService = require("./utils/utilities");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  logger.warn("UNHANDLED EXCEPTION! Shutting down...");
  console.log("UNHANDLED EXCEPTION! Shutting down...");
  UtilityService.handleError(err);
  process.exit(1);
});

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  logger.info("Database connection successful");
  console.log("Database connection successful");
});

const app = require("./app");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`localhost:${port}/`);
  console.log(`localhost:${port}/`);
});

process.on("unhandledRejection", (err) => {
  logger.warn("UNHANDLED REJECTION! Shutting down...");
  console.log("UNHANDLED REJECTION! Shutting down...");
  UtilityService.handleError(err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
