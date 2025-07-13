import { Express } from 'express';
import adminRouter from './admin/admin.routes';
import userRouter from './user/user.routes';
import emailRouter from './email/email.routes';
import mlsRouter from './mls/mls.routes';
import propertyRouter from './property/property.routes';
import goalsRouter from './goals/goals.routes';
import alertsRouter from './alerts/alerts.routes';
import settingsRouter from './settings/settings.routes';
import waitlistRouter from './waitlist/waitlist.routes';
import { errorHandler } from './auth/auth.controller';
import {logger} from '../utils/logger';

export const registerApiRoutes = (app: Express, prefix: string): void => {
  logger.info('Registering API routes');
  app.use(`${prefix}/admin`, adminRouter);
  app.use(`${prefix}/user`, userRouter);
  app.use(`${prefix}/email`, emailRouter);
  app.use(`${prefix}/mls`, mlsRouter);
  app.use(`${prefix}/property`, propertyRouter);
  app.use(`${prefix}/goals`, goalsRouter);
  app.use(`${prefix}/alerts`, alertsRouter);
  app.use(`${prefix}/settings`, settingsRouter);
  app.use(`${prefix}/waitlist`, waitlistRouter);
  app.use(errorHandler);
}; 