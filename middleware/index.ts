import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { logger } from '../utils/logger';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export { SECOND, MINUTE };

export const registerMiddleware = (app: Express): void => {
  logger.info('Registering middleware');
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
            'maps.googleapis.com',
            'unpkg.com/boxicons@2.1.4',
            'cdn.jsdelivr.net/npm/chart.js',
          ],
          imgSrc: [
            "'self'",
            'maps.gstatic.com',
            '*.googleapis.com',
            '*.ggpht.com',
            'cdn-icons-png.flaticon.com',
          ],
          frameSrc: ["'self'", 'maps.googleapis.com', '*.google.com'],
        },
      },
    })
  );
  app.use(cors());

  // parse application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '10kb',
    })
  );
  app.use((req, res, next) => {
    res.header('Cross-Origin-Embedder-Policy', 'cross-origin');
    next();
  });

  // parse application/json
  app.use(bodyParser.json({ limit: '10kb' }));

  if (process.env.NODE_ENV === 'production') {
    // Rate Limiter
    app.use(
      rateLimit({
        windowMs: 15 * MINUTE, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      })
    );
  }

  app.use(cookieParser());

  // Session Key
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY!,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false, // Set to true if using HTTPS
        sameSite: 'strict' as const,
      },
    })
  );
};

export const registerErrorHandler = (app: Express): void => {
  // Error handling middleware can be added here
}; 