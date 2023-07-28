const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getSignupPage,
  getForgotPasswordPage,
  getUserDashboardPage,
  getUserSettingsPage,
  getPaymentPage,
  getPropSearchPage,
  getAdminDashboardPage,
  get404Page,
  get500Page,
  getBlogSinglePage,
  getBlogListPage,
  getAboutPage,
  getContactPage,
  getPricingPage,
} = require("./view.controller");

const { protectedViewRoutes } = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getLandingPage);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/forgot-password", getForgotPasswordPage);
router.get("/404", get404Page);
router.get("/500", get500Page);


router.get("/about", getAboutPage);
router.get("/contact", getContactPage);
router.get("/pricing", getPricingPage);
router.get("/blogs", getBlogListPage);
router.get("/blog/:id", getBlogSinglePage);

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
