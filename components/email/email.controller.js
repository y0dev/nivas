const Email = require("./email.class");
const catchAsync = require("../../utils/catchAsync");
const logger = require("../../utils/logger").logger;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send a contact email
 */
exports.sendContactEmail = catchAsync(async (req, res, next) => {
  try {
    const { email, name, message } = req.body;
    const user = { email, name }; // Assuming these fields are included in the request body
    const url = ''; // Set URL as needed or use an appropriate value

    logger.info("Sending a contact email");
    await new Email(user, url).sendContactEmail();

    res.status(200).json({
      status: "success",
      message: "Contact email sent successfully",
    });
  } catch (error) {
    logger.error("Failed to send contact email", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send contact email",
    });
  }
});
