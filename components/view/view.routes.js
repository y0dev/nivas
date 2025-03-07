const express = require("express");
const {
  getLandingPage,
  getLoginPage,
  getLoginPasswordPage,
  getSignupPage,
  getSignupPasswordPage,
  getForgotPasswordPage,
  getUserDashboardPage,
  getUserSettingsPage,
  getPaymentPage,
  getPropSearchPage,
  getPropSearchAdPage,
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
router.get("/login/password", getLoginPasswordPage);
router.get("/signup", getSignupPage);
router.get("/signup/password", getSignupPasswordPage);
router.get("/forgot-password", getForgotPasswordPage);
router.get("/404", get404Page);
router.get("/500", get500Page);


router.get("/about", getAboutPage);
router.get("/contact", getContactPage);
router.get("/pricing", getPricingPage);
router.get("/blogs", getBlogListPage);
router.get("/blog/:id", getBlogSinglePage);

// router.use();
if (process.env.NODE_ENV == "production") {
  // These following pages should only be for logged in users only
  router.get("/dashboard", protectedViewRoutes, getUserDashboardPage);
  router.get("/prop-search", protectedViewRoutes, getPropSearchPage);
  router.get("/settings", protectedViewRoutes, getUserSettingsPage);

} else if (process.env.NODE_ENV == "development") {
  router.get("/dashboard", getUserDashboardPage);
  router.get("/prop-search", getPropSearchPage);
  router.get("/settings", getUserSettingsPage);
}

router.get("/payment", getPaymentPage);

module.exports = router;
