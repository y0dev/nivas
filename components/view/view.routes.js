const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getLoginPasswordPage,
  getSignupPage,
  getSignupPasswordPage,
  getForgotPasswordPage,
  getUserDashboardPage,
  getUserSettingsPage,
  getPaymentPage,
  getPropSearchPage,
  getPropSearchAdPage,
  get404Page,
  get500Page,
  getBlogSinglePage,
  getBlogListPage,
  getAboutPage,
  getContactPage,
  getPricingPage,
  getEmailSignInPage,
  getUserBillingPage,
  getEmailResetPWPage,
  getEmailContactPage
} = require("./view.controller");

const { protectedViewRoutes } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

/**
 * Retrieve the landing page.
 * @route GET /api/v1/
 * @access Public
 * @returns {HTML} Landing page
 */
router.get("/", getLandingPage);

/**
 * Retrieve the login page.
 * @route GET /api/v1/login
 * @access Public
 * @returns {HTML} Login page
 */
router.get("/login", getLoginPage);

/**
 * Retrieve the password login page.
 * @route GET /api/v1/login/password
 * @access Public
 * @returns {HTML} Password login page
 */
router.get("/login/password", getLoginPasswordPage);

/**
 * Retrieve the signup page.
 * @route GET /api/v1/signup
 * @access Public
 * @returns {HTML} Signup page
 */
router.get("/signup", getSignupPage);

/**
 * Retrieve the signup password page.
 * @route GET /api/v1/signup/password
 * @access Public
 * @returns {HTML} Signup password page
 */
router.get("/signup/password", getSignupPasswordPage);

/**
 * Retrieve the forgot password page.
 * @route GET /api/v1/forgot-password
 * @access Public
 * @returns {HTML} Forgot password page
 */
router.get("/forgot-password", getForgotPasswordPage);

/**
 * Retrieve the 404 error page.
 * @route GET /api/v1/404
 * @access Public
 * @returns {HTML} 404 error page
 */
router.get("/404", get404Page);

/**
 * Retrieve the 500 error page.
 * @route GET /api/v1/500
 * @access Public
 * @returns {HTML} 500 error page
 */
router.get("/500", get500Page);

/**
 * Retrieve the about page.
 * @route GET /api/v1/about
 * @access Public
 * @returns {HTML} About page
 */
router.get("/about", getAboutPage);

/**
 * Retrieve the contact page.
 * @route GET /api/v1/contact
 * @access Public
 * @returns {HTML} Contact page
 */
router.get("/contact", getContactPage);

/**
 * Retrieve the pricing page.
 * @route GET /api/v1/pricing
 * @access Public
 * @returns {HTML} Pricing page
 */
router.get("/pricing", getPricingPage);

/**
 * Retrieve the blog list page.
 * @route GET /api/v1/blogs
 * @access Public
 * @returns {HTML} Blog list page
 */
router.get("/blogs", getBlogListPage);

/**
 * Retrieve a single blog page.
 * @route GET /api/v1/blog/:id
 * @access Public
 * @returns {HTML} Single blog post page
 */
router.get("/blog/:id", getBlogSinglePage);

if (process.env.NODE_ENV == "production") {
  /**
   * Retrieve the user dashboard.
   * @route GET /api/v1/dashboard
   * @access Protected
   * @returns {HTML} User dashboard page
   */
  router.get("/dashboard", protectedViewRoutes, getUserDashboardPage);

  /**
   * Retrieve the property search page.
   * @route GET /api/v1/prop-search
   * @access Protected
   * @returns {HTML} Property search page
   */
  router.get("/prop-search", protectedViewRoutes, getPropSearchPage);

  /**
   * Retrieve the user settings page.
   * @route GET /api/v1/settings
   * @access Protected
   * @returns {HTML} User settings page
   */
  router.get("/settings", protectedViewRoutes, getUserSettingsPage);

  /**
   * Retrieve the billing page.
   * @route GET /api/v1/billing
   * @access Protected
   * @returns {HTML} Billing page
   */
  router.get("/billing", protectedViewRoutes, getUserBillingPage);
} else if (process.env.NODE_ENV == "development") {
  router.get("/dashboard", getUserDashboardPage);
  router.get("/prop-search", getPropSearchPage);
  router.get("/settings", getUserSettingsPage);
  router.get("/billing", getUserBillingPage);
  router.get("/email/signin", getEmailSignInPage);
  router.get("/email/reset", getEmailResetPWPage);
  router.get("/email/contact", getEmailContactPage);
}

/**
 * Retrieve the payment page.
 * @route GET /api/v1/payment
 * @access Public
 * @returns {HTML} Payment page
 */
router.get("/payment", getPaymentPage);

module.exports = router;
