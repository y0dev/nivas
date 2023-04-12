const express = require("express");
const { searchByZipCode, searchByCityState } = require("./mls.controller");

const router = express.Router({ mergeParams: true });

router.post("/searchZip", searchByZipCode);
router.post("/searchCS", searchByCityState);

module.exports = router;
