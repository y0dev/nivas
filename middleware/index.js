const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

const SECOND = 1000;
const MINUTE = 60 * SECOND;

exports.registerMiddleware = (router) => {
  router.use(helmet());
  router.use(cors());

  // parse application/x-www-form-urlencoded
  router.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  router.use(bodyParser.json());

  router.use(
    rateLimit({
      windowMs: 15 * MINUTE, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
  );
};

exports.registerErrorHandler = (router) => {};
