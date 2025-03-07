const jwt = require("jsonwebtoken");
const { User } = require("../user/user.schema");
const { Subscription } = require("../subscription/subscription.schema");
const Email = require("./email.class");
const catchAsync = require("../../utils/catchAsync");
const { subscriptionPlans } = require("../../utils/config");
const logger = require("../../utils/logger").logger;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateMagicToken = (email) => {
  return jwt.sign({ email }, process.env.MAGIC_LINK_SECRET_KEY || "your_secret_key", {
    expiresIn: "15m", // Token expires in 15 minutes
  });
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
    // Find user in the database or create one if not found
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with only the email (no password required initially)
      user = await User.create({
        email,
        // No password field needed at this point
      });

      // Create a subscription for the new user
      const plan = 'basic'; // Default plan
      const planConfig = subscriptionPlans[plan];
      await Subscription.create({
        user: user._id,
        plan,
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year subscription
        allowedSearches: planConfig.allowedSearches,
      });

      logger.info(`User created: ${email}`);
    }

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
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
