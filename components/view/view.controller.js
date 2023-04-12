const catchAsync = require("../../utils/catchAsync");

exports.getLandingPage = catchAsync(async (req, res, next) => {
  res.status(200).render("index", {
    title: "Nivas",
  });
});

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/index", {
    title: "Nivas Dashboard",
  });
});
