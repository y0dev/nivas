const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.warn("UNHANDLED EXCEPTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("connection successful");
});

const app = require("./app");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`localhost:${port}/`);
});

process.on("unhandledRejection", (err) => {
  console.warn("UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
