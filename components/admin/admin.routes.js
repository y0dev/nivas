const express = require("express");
const {
  protect,
  userCount,
  premiumUserCount,
  newUserCount,
  searchCount,
} = require("../auth/auth.controller");

const router = express.Router({ mergeParams: true });

// Routes that only logged in user can access
router.use(protect);

router.get("/count/users", userCount);
router.get("/count/newUsers", newUserCount);
router.get("/count/premiumUsers", premiumUserCount);
router.get("/count/searches", searchCount);

module.exports = router;
