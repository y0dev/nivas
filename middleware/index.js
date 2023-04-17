const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

const SECOND = 1000;
const MINUTE = 60 * SECOND;

exports.SECOND = SECOND;
exports.MINUTE = MINUTE;

exports.registerMiddleware = (app) => {
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
  );
  app.use(cors());

  // parse application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "10kb",
    })
  );

  // parse application/json
  app.use(bodyParser.json({ limit: "10kb" }));

  app.use(
    rateLimit({
      windowMs: 15 * MINUTE, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
  );
};

exports.registerErrorHandler = (app) => {};
