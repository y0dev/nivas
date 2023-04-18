const catchAsync = require("../../utils/catchAsync");

exports.getLandingPage = catchAsync(async (req, res, next) => {
  res.status(200).render("index", {
    title: "Nivas",
  });
});

exports.getLoginPage = catchAsync(async (req, res, next) => {
  res.status(200).render("signup-login/login", {
    title: "Nivas Login",
  });
});

exports.getSignupPage = catchAsync(async (req, res, next) => {
  res.status(200).render("signup-login/signup", {
    title: "Nivas Signup",
  });
});

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/index", {
    title: "Nivas Dashboard",
  });
});
