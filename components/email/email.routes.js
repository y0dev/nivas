const express = require("express");
const { sendContactEmail } = require("./email.controller");

const router = express.Router({ mergeParams: true });

router.post("/contactUs", sendContactEmail);

module.exports = router;
