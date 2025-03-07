const express = require("express");
const { makePayment, createCheckoutSession } = require("./payment.controller");

const router = express.Router({ mergeParams: true });

router.post("/", createCheckoutSession);

module.exports = router;
