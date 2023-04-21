const express = require("express");
const {
  searchByZipCode,
  searchByCityState,
  getSearches,
} = require("./mls.controller");

const router = express.Router({ mergeParams: true });

router.post("/history/:token", getSearches);
router.post("/searchZip", searchByZipCode);
router.post("/searchCS", searchByCityState);

module.exports = router;
