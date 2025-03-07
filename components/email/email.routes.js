const express = require("express");
const { sendContactEmail, sendMagicLinkEmail } = require("./email.controller");

const router = express.Router({ mergeParams: true });

router.post("/contactUs", sendContactEmail);
router.post("/send-magic-link", sendMagicLinkEmail);

module.exports = router;
