import { Request, Response, NextFunction } from 'express';
import Email from './email.class';
import catchAsync from '../../utils/catchAsync';
import logger from '../../utils/logger';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendContactEmail = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  req.params.id = req.user!.id;
  logger.info('Sending an contact email');
  await new Email({} as any, '').sendContactEmail();

  next();
}); 