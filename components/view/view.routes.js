const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getSignupPage,
  getUserDashboardPage,
  getUserSettingsPage,
  get404Page,
  getPaymentPage,
  getPropSearchPage,
  getAdminDashboardPage,
} = require("./view.controller");

const { protectedViewRoutes } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/error", get404Page);

// These following pages should only be for logged in users only
// router.use();
router.get("/test-admin-dash", getAdminDashboardPage);
router.get("/test-user-dash", getUserDashboardPage);
router.get("/test-search", getPropSearchPage);

router.get("/dashboard", protectedViewRoutes, getUserDashboardPage);
router.get("/prop-search", protectedViewRoutes, getPropSearchPage);
router.get("/settings", protectedViewRoutes, getUserSettingsPage);

router.get("/payment", getPaymentPage);

module.exports = router;
