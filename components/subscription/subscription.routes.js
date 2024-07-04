const express = require("express");
const { createSubscription, getSubscriptions, cancelSubscription } = require("./subscription.controller");

const { protect } = require("../auth/auth.controller");
const router = express.Router({ mergeParams: true });

// Conditionally apply the `protect` middleware in non-development environments
if (process.env.NODE_ENV !== "development") {
  router.use(protect);
}

/**
 * Route to create a new subscription
 * @route POST /create
 * @access Protected (if not in development)
 * @param {string} userId - ID of the user
 * @param {string} plan - Subscription plan (e.g., basic, premium, vip)
 * @param {Date} endDate - End date of the subscription
 * @returns {Object} Subscription object
 */
router.post("/create", createSubscription);

/**
 * Route to get all subscriptions for the logged-in user
 * @route POST /mine
 * @access Protected (if not in development)
 * @returns {Array} Array of subscription objects
 */
router.post("/mine", getSubscriptions);

/**
 * Route to cancel a subscription for the logged-in user
 * @route GET /cancel
 * @access Protected (if not in development)
 * @param {string} subscriptionId - ID of the subscription to be canceled
 * @returns {Object} Updated subscription object with active set to false
 */
router.get("/cancel", cancelSubscription);

module.exports = router;
