const catchAsync = require("../../utils/catchAsync");

exports.getLandingPage = catchAsync(async (req, res, next) => {
  res.status(200).render("index", {
    title: "Home",
  });
});

exports.getLoginPage = catchAsync(async (req, res, next) => {
  res.status(200).render("signup-login/login", {
    title: "Login",
  });
});

exports.getSignupPage = catchAsync(async (req, res, next) => {
  res.status(200).render("signup-login/signup", {
    title: "Signup",
  });
});

exports.getAdminDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/admin_dash/index", {
    title: "Admin Dashboard",
  });
});

exports.getUserDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/user_dash/index", {
    title: "User Dashboard",
  });
});

exports.getPropSearchPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/user_dash/properties_search", {
    title: "Properties Search",
  });
});

exports.getUserSettingsPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/user_dash/settings", {
    title: "User Settings",
  });
});

exports.getPaymentPage = catchAsync(async (req, res, next) => {
  res.status(200).render("payment/index", {
    title: "Payment",
  });
});

exports.get404Page = catchAsync(async (req, res, next) => {
  res.status(200).render("error/404", {
    title: "404 Error",
  });
});

exports.get500Page = catchAsync(async (req, res, next) => {
  res.status(200).render("error/500", {
    title: "500 Error",
  });
});