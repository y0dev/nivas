const express = require("express");
const { makePayment, createCheckoutSession } = require("./payment.controller");

const router = express.Router({ mergeParams: true });

router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
