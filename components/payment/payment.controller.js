
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
  // 1. Retrieve Stripe Price Information
  // This section fetches the price details from Stripe based on the lookup key provided in the request body.
  // The 'expand' option is used to include the associated product information in the response.
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key], // Lookup key to find the correct price in Stripe.
    expand: ['data.product'], // Expand the response to include product details.
  });

  // 2. Create Stripe Checkout Session
  // This creates a new Stripe Checkout session for subscription payments.
  // It configures billing address collection, line items, payment mode, and success/cancel URLs.
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto', // Automatically collect billing address.
    line_items: [
      {
        price: prices.data[0].id, // Use the retrieved price ID.
        // For metered billing, do not pass quantity. Here, quantity is set to 1,
        // indicating a single subscription.
        quantity: 1,
      },
    ],
    mode: 'subscription', // Set the mode to 'subscription' for recurring payments.
    success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`, // URL to redirect after successful payment.
    cancel_url: `${YOUR_DOMAIN}/cancel.html`, // URL to redirect if payment is canceled.
  });

  // 3. Redirect to Stripe Checkout
  // This redirects the user to the Stripe Checkout URL to complete the payment.
  res.redirect(303, session.url); // Redirect with a 303 status code (See Other).
});

exports.webhookHandler = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data;
  const eventType = event.type;

  await connectMongo();

  switch (eventType) {
    case 'checkout.session.completed': {
      // First payment is successful and a subscription is created
      let user;
      const session = await stripe.checkout.sessions.retrieve(data.object.id, {
        expand: ['line_items'],
      });
      const customerId = session?.customer;
      const customer = await stripe.customers.retrieve(customerId);
      const priceId = session?.line_items?.data[0]?.price.id;

      if (customer.email) {
        user = await User.findOne({ email: customer.email });

        if (!user) {
          user = await User.create({
            email: customer.email,
            name: customer.name,
            customerId,
          });

          await user.save();
        }
      } else {
        console.error('No user found');
        throw new Error('No user found');
      }

      user.priceId = priceId;
      user.hasAccess = true;
      await user.save();

      break;
    }

    case 'customer.subscription.deleted': {
      // Subscription canceled
      const subscription = await stripe.subscriptions.retrieve(data.object.id);
      const user = await User.findOne({
        customerId: subscription.customer,
      });

      if (user) {
        user.hasAccess = false;
        await user.save();
      }
      break;
    }

    case 'customer.subscription.updated': {
      // Subscription updated (e.g., plan change, payment method update)
      const subscription = await stripe.subscriptions.retrieve(data.object.id);
      const user = await User.findOne({ customerId: subscription.customer });

      if (user) {

        const priceId = subscription.items.data[0].price.id;

        user.priceId = priceId;
        await user.save();
      }

      break;
    }

    case 'invoice.payment_succeeded': {
      //Payment succeeded on an invoice.
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const user = await User.findOne({ customerId: subscription.customer });

        if(user){
          console.log(`Payment succeeded for user: ${user.email} subscription: ${subscriptionId}`);
        }
      }

      break;
    }
      
    case 'invoice.paid': {
      // Invoice is paid. This can happen for one-time invoices or subscription invoices.
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const user = await User.findOne({ customerId: subscription.customer });

        if (user) {
          console.log(
            `Invoice paid for user: ${user.email} subscription: ${subscriptionId}`
          );
        }
      } else {
          console.log("One time invoice paid for customer:" + invoice.customer);
      }
      break;
    }

    case 'invoice.payment_failed': {
      // Payment failed on an invoice.
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      if(subscriptionId){
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const user = await User.findOne({ customerId: subscription.customer });

        if(user){
          console.log(`Payment failed for user: ${user.email} subscription: ${subscriptionId}`);
          //Consider sending an email to the user.
        }
      }

      break;
    }

    default:
      // Unhandled event type
  }

  res.status(200).send('OK');
});