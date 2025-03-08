const express = require("express");
const {
  searchByZipCode,
  searchByCityState,
  getSearches,
  downloadPreviousSearch,
  downloadSample,
} = require("./mls.controller");

const { protect } = require("../auth/auth.controller");
const {checkSubscription} = require("../subscription/subscription.controller");

const router = express.Router({ mergeParams: true });

/**
 * Protect routes for authenticated users.
 * @route GET /api/v1/mls
 * @access Protected
 * @returns {Object} User details
 * @throws {401} Unauthorized if the user is not authenticated
 */
if (process.env.NODE_ENV !== "development") {
  router.use(protect);
}

/**
 * Search properties by zip code.
 * @route POST /api/v1/mls/searchZip
 * @access Protected (if not in development)
 * @param {string} zip - The zip code to search
 * @returns {Object} Property search results
 * @throws {400} If the zip code is invalid or missing
 * @throws {403} If the user does not have the required subscription level
 * @throws {500} Internal server error if the search fails
 */
router.post("/searchZip", checkSubscription("basic"), searchByZipCode);

/**
 * Search properties by city and state.
 * @route POST /api/v1/mls/searchCS
 * @access Protected (if not in development)
 * @param {string} city - The city name
 * @param {string} state - The state abbreviation
 * @returns {Object} Property search results
 * @throws {400} If the city or state is invalid or missing
 * @throws {403} If the user does not have the required subscription level
 * @throws {500} Internal server error if the search fails
 */
router.post("/searchCS", checkSubscription("basic"), searchByCityState);

/**
 * Download the previous search results as a PDF.
 * @route GET /api/v1/mls/download-pdf
 * @access Protected (if not in development)
 * @returns {Object} PDF file containing search results
 * @throws {403} If the user does not have a premium subscription
 * @throws {500} Internal server error if the PDF cannot be generated or retrieved
 */
router.get("/download-pdf", checkSubscription("premium"), downloadPreviousSearch);

/**
 * Retrieve the user's search history.
 * @route GET /api/v1/mls/history
 * @access Protected (if not in development)
 * @returns {Object} List of past searches
 * @throws {403} If the user does not have the required subscription level
 * @throws {500} Internal server error if the search history retrieval fails
 */
router.get("/history", checkSubscription("basic"), getSearches);

module.exports = router;
