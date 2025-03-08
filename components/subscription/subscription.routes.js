const express = require("express");
const {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  getSubscriptionPlans,
  purchaseSubscription,
  upgradeSubscription,
  downgradeSubscription,
  getUpgradeOptions
} = require("./subscription.controller");

const { protect } = require("../auth/auth.controller");
const router = express.Router({ mergeParams: true });

/**
 * Protect routes for authenticated users.
 * @route GET /api/v1/subscription
 * @access Protected
 * @returns {Object} User details
 * @throws {401} Unauthorized if the user is not authenticated
 */
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

/**
 * Route to get subscription plans and their details
 * @route GET /plans
 * @returns {Object} Subscription plans and details
 */
router.get("/plans", getSubscriptionPlans);

/**
 * Route to purchase a subscription
 * @route POST /purchase
 * @access Protected (if not in development)
 */
router.post("/purchase", purchaseSubscription);

/**
 * Upgrade subscription
 * @route POST /api/v1/subscription/upgrade
 * @access Protected (if not in development)
 * @param {string} subscriptionId - ID of the subscription to be upgraded
 * @returns {Object} Updated subscription object
 */
router.post("/upgrade", upgradeSubscription);

/**
 * Downgrade subscription
 * @route POST /api/v1/subscription/downgrade
 * @access Protected (if not in development)
 * @param {string} subscriptionId - ID of the subscription to be downgraded
 * @returns {Object} Updated subscription object
 */
router.post("/downgrade", downgradeSubscription);

/**
 * Retrieve upgrade options
 * @route GET /api/v1/subscription/upgrade-options
 * @access Protected
 * @returns {Object[]} Available upgrade options
 */
router.get("/upgrade-options", getUpgradeOptions);

module.exports = router;
