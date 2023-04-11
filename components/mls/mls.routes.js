const express = require("express");
const { searchByZipCode, searchByCityState } = require("./mls.controller");

const router = express.Router({ mergeParams: true });

router.get("/searchZip", searchByZipCode);
router.get("/searchCS", searchByCityState);

module.exports = router;
