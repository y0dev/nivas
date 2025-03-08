const express = require("express");
const { sendContactEmail, sendMagicLinkEmail } = require("./email.controller");

const router = express.Router({ mergeParams: true });

/**
 * Send a contact email from the user to the support team.
 * @route POST /api/v1/email/contactUs
 * @access Public
 * @param {string} name - The sender's name
 * @param {string} email - The sender's email address
 * @param {string} message - The message content
 * @returns {Object} Success message if the email is sent successfully
 * @throws {400} If required fields are missing
 * @throws {500} If there is an issue sending the email
 */
router.post("/contactUs", sendContactEmail);

/**
 * Send a magic link email for passwordless authentication.
 * @route POST /api/v1/email/send-magic-link
 * @access Public
 * @param {string} email - The recipient's email address
 * @returns {Object} Success message if the magic link is sent successfully
 * @throws {400} If the email is invalid or missing
 * @throws {500} If there is an issue sending the email
 */
router.post("/send-magic-link", sendMagicLinkEmail);


module.exports = router;
