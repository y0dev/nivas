const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getSignupPage,
  getDashboardPage,
} = require("./view.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/dashboard", getDashboardPage);

module.exports = router;
