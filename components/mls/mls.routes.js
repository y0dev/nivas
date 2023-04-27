const express = require("express");
const {
  searchByZipCode,
  searchByCityState,
  getSearches,
} = require("./mls.controller");

const { protect } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

router.use(protect).post("/searchZip", searchByZipCode);
router.use(protect).post("/searchCS", searchByCityState);

router.use(protect).get("/history", getSearches);

module.exports = router;
