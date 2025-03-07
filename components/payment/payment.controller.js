
const catchAsync = require("../../utils/catchAsync");
const { logger } = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.makePayment = catchAsync(async (req, res, next) => {
  const { amount, currency, source, items } = req.body;
  logger.info("Making a payment");

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    payment_method_types: ["card"],
    payment_method: source,
  });

  // Confirm the payment intent
  const confirmedPayment = await stripe.paymentIntents.confirm(
    paymentIntent.id
  );

  if (!confirmedPayment) {
    return next(new AppError("Could not make payment", 401));
  }

  req.payment = {
    amount,
    items,
  };
  next();
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});