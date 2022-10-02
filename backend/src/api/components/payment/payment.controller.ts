import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
   apiVersion: '2022-08-01',
 });

export class PaymentController {
   private readonly AMOUNT = 50;

  /*
   * Create user for payment
   *
   * @param req Express request
   * @param res Express response
   * @param next Express next
   * @returns HTTP response
   */
  @bind
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
     try {
         const { email, firstName, lastName } = req.body;

         // Create a new customer and then create an invoice item then invoice it:
         stripe.customers.create({
            email: email,
            name: `${firstName} ${lastName}`
         }).then((customer) => {
            // have access to the customer object
            return stripe.invoiceItems.create({
               customer: customer.id, // set the customer id
               amount: this.AMOUNT, // 5 Calculation
               currency: 'usd',
               description: 'One-time setup fee',
            }).then((invoiceItem) => {
               return stripe.invoices.create({
                  collection_method: 'send_invoice',
                  customer: invoiceItem.customer.toString()
               });
            }).then((invoice) => {
               // New invoice created on a new customer
            }).catch((err) => { 
               return next(err);
            });
         });

        return res.json('payment');
     } catch (err) {
        return next(err);
     }
  }
}