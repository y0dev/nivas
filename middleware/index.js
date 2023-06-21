const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("../utils/logger").logger;

const SECOND = 1000;
const MINUTE = 60 * SECOND;

exports.SECOND = SECOND;
exports.MINUTE = MINUTE;

exports.registerMiddleware = (app) => {
  logger.info("Registering middleware");
  app.use(
    helmet({
      crossOriginEmbedderPolicy: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "maps.googleapis.com",
            "unpkg.com/boxicons@2.1.4",
            "cdn.jsdelivr.net/npm/chart.js",
          ],
          imgSrc: [
            "'self'",
            "maps.gstatic.com",
            "*.googleapis.com",
            "*.ggpht.com",
          ],
          frameSrc: ["'self'", "maps.googleapis.com", "*.google.com"],
        },
      },
    })
  );
  app.use(cors());

  // parse application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "10kb",
    })
  );
  app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "cross-origin");
    next();
  });

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

  app.use(cookieParser());

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );
};

exports.registerErrorHandler = (app) => {};
