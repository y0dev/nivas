const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  updateUserDetails,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
  purchaseCoins,
  selectSubscription,
} = require("./user.controller");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  logout,
} = require("../auth/auth.controller");
const { makePayment } = require("../payment/payment.controller");

const router = express.Router({ mergeParams: true });

// Routes that anyone can access
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Routes that only logged in user can access
router.use(protect);

router.get("/me", getMe, getUser);
router.patch("/update/password", updatePassword);
router.patch(
  "/update/details",
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserDetails
);

// Purchase coins
router.patch("/purchase", makePayment, purchaseCoins);

router.delete("/deleteUser", deleteUser);

module.exports = router;
