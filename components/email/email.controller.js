const Email = require("./email.class");
const catchAsync = require("../../utils/catchAsync");
const logger = require("../../utils/logger").logger;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendContactEmail = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  logger.info("Sending an contact email");
  await new Email("", "").sendContactEmail();

  next();
});
