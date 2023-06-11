const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getSignupPage,
  getDashboardPage,
  getSettingsPage,
  get404Page,
  getPaymentPage,
  getSearchPage,
} = require("./view.controller");

const { protectedViewRoutes } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/error", get404Page);

// These following pages should only be for logged in users only
// router.use();
router.get("/test-search", getDashboardPage);
router.get("/search", protectedViewRoutes, getSearchPage);
router.get("/settings", protectedViewRoutes, getSettingsPage);

router.get("/payment", getPaymentPage);

module.exports = router;
