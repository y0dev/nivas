const logger = require("./utils/logger").logger;
const mongoose = require("mongoose");
const { User } = require("./components/user/user.schema");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  logger.info("Database connection successful");
  console.log("Database connection successful");
});

// Upload sample data
const sampleData = [
  {
    name: "Devontae Reid",
    email: "devdoesit17@gmail.com",
    password: process.env.ADMIN_PW,
    confirmPassword: process.env.ADMIN_PW,
    subscriptionTier: "premium",
    subscriptionDate: new Date(),
    isAdmin: true,
  },
  //   { name: "Jane", age: 25 },
  //   // Add more sample data as needed
];

User.create(sampleData)
  .then(() => {
    console.log("User data uploaded successfully.");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error uploading sample data:", error);
    mongoose.disconnect();
  });
