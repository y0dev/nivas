const Email = require("./email.class");
const catchAsync = require("../../utils/catchAsync");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendContactEmail = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  await new Email("", "").sendContactEmail();

  next();
});
