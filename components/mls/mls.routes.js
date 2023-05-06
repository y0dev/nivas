const express = require("express");
const {
  searchByZipCode,
  searchByCityState,
  getSearches,
  downloadPreviousSearch,
  downloadSample,
} = require("./mls.controller");

const { protect } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

// router.get("/sample-pdf", downloadSample);
// Add an protect middleware to authenticate user
// router.use(protect);

router.post("/searchZip", searchByZipCode);
router.post("/searchCS", searchByCityState);

router.get("/download-pdf", downloadPreviousSearch);
router.get("/history", getSearches);

module.exports = router;
