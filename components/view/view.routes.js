const express = require("express");
const { getLandingPage, getDashboardPage } = require("./view.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/dashboard", getDashboardPage);

module.exports = router;
