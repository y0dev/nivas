import { Express } from 'express';
import adminRouter from './admin/admin.routes';
import userRouter from './user/user.routes';
import emailRouter from './email/email.routes';
import mlsRouter from './mls/mls.routes';
import { errorHandler } from './auth/auth.controller';
import {logger} from '../utils/logger';

export const registerApiRoutes = (app: Express, prefix: string): void => {
  logger.info('Registering API routes');
  app.use(`${prefix}/admin`, adminRouter);
  app.use(`${prefix}/user`, userRouter);
  app.use(`${prefix}/email`, emailRouter);
  app.use(`${prefix}/mls`, mlsRouter);
  app.use(errorHandler);
}; 