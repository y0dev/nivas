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

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/index", {
    title: "User Dashboard",
  });
});

exports.getSearchPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/properties_search", {
    title: "Properties Search",
  });
});

exports.getSettingsPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/settings", {
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
    title: "Error",
  });
});
