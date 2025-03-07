const jwt = require("jsonwebtoken");
const Email = require("./email.class");
const catchAsync = require("../../utils/catchAsync");
const logger = require("../../utils/logger").logger;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateMagicToken = (email) => {
  return crypto.createHash("sha256").update(email + Date.now().toString()).digest("hex");
}

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

exports.sendMagicLinkEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  logger.info(`Sending Magic Link to ${email}...`);
  
  if (!email) {
    return res.status(400).json({ status: "fail", message: "Email is required" });
  }

  try {

    // Generate Magic Link Token
    const token = generateMagicToken(email);
    const magicLink = `https://www.urbaninsightinc.com/magic-link?token=${token}`;

    await new Email(user, magicLink).sendMagicLink();

    res.status(200).json({ status: "success", message: "Magic link sent!" });
  } catch (error) {
    logger.error("Error sending magic link:", error);
    res.status(500).json({ status: "error", message: "Failed to send magic link" });
  }
});
