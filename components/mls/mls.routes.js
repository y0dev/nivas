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

// Conditionally apply the `protect` middleware in non-development environments
if (process.env.NODE_ENV !== "development") {
  router.use(protect);
}

/**
 * Route to search by zip code
 * @route POST /searchZip
 * @access Protected (if not in development)
 */
router.post("/searchZip",checkSubscription('basic'), searchByZipCode);

/**
 * Route to search by city and state
 * @route POST /searchCS
 * @access Protected (if not in development)
 */
router.post("/searchCS",checkSubscription('basic'), searchByCityState);

/**
 * Route to download the previous search results PDF
 * @route GET /download-pdf
 * @access Protected (if not in development)
 */
router.get("/download-pdf",checkSubscription('premium'), downloadPreviousSearch);

/**
 * Route to get search history
 * @route GET /history
 * @access Protected (if not in development)
 */
router.get("/history", checkSubscription('basic'), getSearches);

module.exports = router;
