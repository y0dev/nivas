const path = require("path");
const express = require("express");
const { registerApiRoutes } = require("./components");
const { registerMiddleware } = require("./middleware");

// const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex");

// console.log(secretKey);

// Create a server
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", (req, res) => {
//   res.status(200).render("landing", {
//     title: "Entity API",
//   });
// });

registerMiddleware(app);
registerApiRoutes(app, "/api/v1");

module.exports = app;
