const path = require("path");
const express = require("express");
const { registerApiRoutes } = require("./components");
const { registerMiddleware } = require("./middleware");

// Create a server
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

registerMiddleware(app);
registerApiRoutes(app, "/api/v1");

module.exports = app;
