const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  updateUserDetails,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
  purchaseCoins,
  selectSubscription,
  setCookieConsent,
  getCookieConsent,
  getMagicLink,
  getSearchHistory,
  getBillingDetails,
  getRemainingSearches,
  getRecentSearches,
  getSavedProperties
} = require("./user.controller");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  logout,
} = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

// Routes that anyone can access
/**
 * Sign up a new user
 * @route POST /api/v1/user/signup
 * @access Public
 * @param {Object} userDetails - User details including email, password, and other required fields
 * @returns {Object} Created user object
 * @throws {400} Invalid user data provided
 * @throws {500} Internal server error if there is an issue during user creation
 */
router.post("/signup", signUp);

/**
 * Log in an existing user
 * @route POST /api/v1/user/login
 * @access Public
 * @param {Object} credentials - User credentials including email and password
 * @returns {Object} Authenticated user object with token
 * @throws {400} Invalid credentials provided
 * @throws {500} Internal server error if there is an issue during login
 */
router.post("/login", login);

/**
 * Log out the current user
 * @route GET /api/v1/user/logout
 * @access Protected
 * @returns {Object} Success message confirming user logout
 * @throws {500} Internal server error if there is an issue during logout
 */
router.get("/logout", logout);

/**
 * Send a magic link for login
 * @route GET /api/v1/user/magic-link
 * @access Public
 * @returns {Object} Success message confirming magic link sent
 * @throws {500} Internal server error if there is an issue sending the magic link
 */
router.get("/magic-link", getMagicLink);

/**
 * Request a password reset link
 * @route POST /api/v1/user/forgotPassword
 * @access Public
 * @param {string} email - User's email address
 * @returns {Object} Success message confirming reset link sent
 * @throws {400} Invalid email address
 * @throws {500} Internal server error if there is an issue sending the reset link
 */
router.post("/forgotPassword", forgotPassword);

/**
 * Reset the password with the provided token
 * @route PATCH /api/v1/user/resetPassword/:token
 * @access Public
 * @param {string} token - The reset token
 * @param {string} password - The new password
 * @returns {Object} Success message confirming password reset
 * @throws {400} Invalid or expired reset token
 * @throws {500} Internal server error if there is an issue resetting the password
 */
router.patch("/resetPassword/:token", resetPassword);

/**
 * Protect routes for authenticated users
 * @route GET /api/v1/user/me
 * @access Protected
 * @returns {Object} User details
 * @throws {401} Unauthorized if the user is not authenticated
 */
if (process.env.NODE_ENV !== "development") {
  router.use(protect);
}

/**
 * Retrieve the logged-in user's details
 * @route GET /api/v1/user/me
 * @access Protected
 * @returns {Object} Logged-in user's details
 * @throws {500} Internal server error if there is an issue retrieving user details
 */
router.get("/me", getMe, getUser);

/**
 * Retrieve search history based on the requested period (week, two weeks, or month).
 * @route GET /api/v1/user/search-history/:period
 * @access Protected (requires user to be authenticated)
 * @param {string} period - The time period for filtering search history ('week', 'twoWeeks', 'month')
 * @returns {Object} Search history data for the specified period
 * @throws {400} Invalid period provided (not 'week', 'twoWeeks', or 'month')
 * @throws {500} Internal server error if there is an issue retrieving search history
 */
router.get("/search-history/:period", getSearchHistory);

/**
 * Retrieve billing details for the logged-in user
 * @route GET /api/v1/user/billing
 * @access Protected (requires user to be authenticated)
 * @returns {Object} User's billing details
 * @throws {500} Internal server error if there is an issue retrieving billing details
 */
router.get("/billing", getBillingDetails);

/**
 * Retrieve the remaining searches for the user
 * @route GET /api/v1/user/remaining-searches
 * @access Protected (requires user to be authenticated)
 * @returns {Object} Remaining searches for the user
 * @throws {500} Internal server error if there is an issue retrieving remaining searches
 */
router.get("/remaining-searches", getRemainingSearches);

/**
 * Retrieve recent searches for the logged-in user
 * @route GET /api/v1/user/recent-searches
 * @access Protected (requires user to be authenticated)
 * @returns {Object} Recent search history for the user
 * @throws {500} Internal server error if there is an issue retrieving recent searches
 */
router.get("/recent-searches", getRecentSearches);

/**
 * Retrieve saved properties for the logged-in user
 * @route GET /api/v1/user/saved-properties
 * @access Protected (requires user to be authenticated)
 * @returns {Object} List of saved properties
 * @throws {500} Internal server error if there is an issue retrieving saved properties
 */
router.get("/saved-properties", getSavedProperties);

/**
 * Update the user's password
 * @route PATCH /api/v1/user/update/password
 * @access Protected (requires user to be authenticated)
 * @param {string} password - New password to be set
 * @returns {Object} Success message confirming password update
 * @throws {500} Internal server error if there is an issue updating the password
 */
router.patch("/update/password", updatePassword);

/**
 * Update user profile details including photo
 * @route PATCH /api/v1/user/update/details
 * @access Protected (requires user to be authenticated)
 * @param {Object} userDetails - User details to be updated (e.g., name, email, etc.)
 * @param {Object} photo - Photo to be uploaded
 * @returns {Object} Success message confirming user details update
 * @throws {500} Internal server error if there is an issue updating user details
 */
router.patch("/update/details", uploadUserPhoto, resizeUserPhoto, updateUserDetails);

/**
 * Set cookie consent for the user
 * @route POST /api/v1/user/cookie-consent
 * @access Protected (requires user to be authenticated)
 * @returns {Object} Success message confirming cookie consent
 * @throws {500} Internal server error if there is an issue setting cookie consent
 */
router.post('/cookie-consent', setCookieConsent);

/**
 * Get cookie consent status for the user
 * @route GET /api/v1/user/cookie-consent
 * @access Protected (requires user to be authenticated)
 * @returns {Object} Cookie consent status
 * @throws {500} Internal server error if there is an issue getting cookie consent
 */
router.get('/cookie-consent', getCookieConsent);

/**
 * Delete the user's account
 * @route DELETE /api/v1/user/deleteUser
 * @access Protected (requires user to be authenticated)
 * @returns {Object} Success message confirming account deletion
 * @throws {500} Internal server error if there is an issue deleting the user account
 */
router.delete("/deleteUser", deleteUser);

module.exports = router;
