const { Subscription } = require('./subscription.schema');
const logger = require("../../utils/logger").logger;
const UtilityService = require("../../utils/utilities");
const { subscriptionPlans, TRIAL_PERIOD_DAYS } = require("../../utils/config");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


/**
 * Helper function to get user ID from the request
 * @param {Object} req - The request object
 * @returns {string} - The user ID
 */
const getUserId = (req) => {
    return process.env.NODE_ENV === "development"
      ? process.env.DEV_OBJ_ID
      : req.user.id;
  };

/**
 * Create a new subscription for a user
 * @route POST /api/v1/subscriptions/create
 * @access Protected (if not in development)
 * @param {string} userId - ID of the user
 * @param {string} plan - Subscription plan (e.g., basic, premium, vip)
 * @param {Date} endDate - End date of the subscription
 * @returns {Object} Subscription object
 */
exports.createSubscription = catchAsync(async (req, res, next) => {
  const { userId, plan, billingInterval } = req.body;

  const planConfig = subscriptionPlans[plan]?.[billingInterval];
  if (!planConfig) {
    return next(new AppError('Invalid subscription plan or billing interval', 400));
  }

  logger.debug(`Current Plan: ${planConfig}`);

  // Calculate the end date based on the billing interval
  const endDate = new Date();
  if (billingInterval === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (billingInterval === 'annual') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Check if the user is eligible for a trial
  const user = await User.findById(userId);
  const hasActiveSubscription = await Subscription.findOne({
    user: userId,
    active: true,
    endDate: { $gte: new Date() },
  });

  let trialEndDate = null;
  if (!hasActiveSubscription) {
    trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);
  }

  const subscription = await Subscription.create({
    user: userId,
    plan,
    billingInterval,
    endDate,
    trialEndDate,
    allowedSearches: planConfig.allowedSearches,
  });

  user.subscriptions.push(subscription._id);
  await user.save();

  const payment = await Payment.create({
    user: userId,
    amount: planConfig.price,
    subscription: subscription._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      subscription,
      payment,
    },
  });
});


/**
 * Get all subscriptions for the logged-in user
 * @route POST /api/v1/subscriptions/mine
 * @access Protected (if not in development)
 * @returns {Array} Array of subscription objects
 */
exports.getSubscriptions = catchAsync(async (req, res, next) => {
  const subscriptions = await Subscription.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      subscriptions,
    },
  });
});

/**
 * Cancel a subscription for the logged-in user
 * @route GET /api/v1/subscriptions/cancel
 * @access Protected (if not in development)
 * @param {string} subscriptionId - ID of the subscription to be canceled
 * @returns {Object} Updated subscription object with active set to false
 */
exports.cancelSubscription = catchAsync(async (req, res, next) => {
  const { subscriptionId } = req.body;

  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    return next(new AppError('No subscription found with that ID', 404));
  }

  // Set subscription to inactive
  subscription.active = false;
  await subscription.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

/**
 * Middleware to check subscription level and remaining searches
 * @param {string} requiredPlan - Required subscription plan
 * @returns Middleware function
 */
exports.checkSubscription = (requiredPlan) => {
  return catchAsync(async (req, res, next) => {
    const userId = getUserId(req);

    // Find active subscription for the user
    const subscription = await Subscription.findOne({
      user: userId,
      plan: requiredPlan,
      active: true,
      endDate: { $gte: new Date() },
    });

    if (!subscription) {
      return next(new AppError('You do not have the required subscription to perform this action', 403));
    }

    // Check if user has searches left for the month
    if (subscription.searchesMade >= subscription.allowedSearches) {
      return next(new AppError('You have used all your searches for this month', 403));
    }

    // Increment searches made
    subscription.searchesMade += 1;
    await subscription.save();

    next();
  });
};

/**
 * Get subscription plans and their details
 */
exports.getSubscriptionPlans = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: subscriptionPlans,
  });
};