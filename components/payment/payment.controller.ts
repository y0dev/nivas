import { Request, Response, NextFunction } from 'express';
import stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import logger from '../../utils/logger';
import AppError from '../../utils/appError';

// Initialize Stripe
const stripeInstance = stripe('YOUR_STRIPE_SECRET_KEY');

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      payment?: {
        amount: number;
        items: any[];
      };
    }
  }
}

// Request body interface
interface PaymentBody {
  amount: number;
  currency: string;
  source: string;
  items: any[];
}

export const makePayment = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { amount, currency, source, items } = req.body as PaymentBody;
  logger.info('Making a payment');

  // Create a payment intent
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: amount,
    currency: currency,
    payment_method_types: ['card'],
    payment_method: source,
  });

  // Confirm the payment intent
  const confirmedPayment = await stripeInstance.paymentIntents.confirm(
    paymentIntent.id
  );

  if (!confirmedPayment) {
    return next(new AppError('Could not make payment', 401));
  }

  req.payment = {
    amount,
    items,
  };
  next();
}); 