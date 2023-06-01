const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY");
const catchAsync = require("../../utils/catchAsync");
const { logger } = require("../../utils/logger");

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
