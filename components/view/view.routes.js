const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getSignupPage,
  getDashboardPage,
  getSettingsPage,
} = require("./view.controller");

const { protect } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);

// These following pages should only be for logged in users only
// router.use(protect);

router.get("/search", getDashboardPage);
router.get("/settings", getSettingsPage);

module.exports = router;
