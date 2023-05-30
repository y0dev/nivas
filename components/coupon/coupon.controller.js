const { Coupon } = require("./coupon.schema");
const { CouponStatusTracker } = require("./coupon.class");

// Coupon Status Tracker
const updateCouponStatus = async (code) => {
  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const currentDate = new Date();

  if (currentDate > coupon.expirationDate) {
    coupon.status = "expired";
  }

  await coupon.save();
};

// Coupon Validator
const validateCouponCode = (code) => {
  // Add your validation logic here
  // You can use the Coupon or any other data source to validate the code
  // For example, you can check if the code exists in the database and is active

  // Return true or false based on the validation result
  return true;
};

// Validate coupon code
const couponCode = "ABC123";
const isValid = validateCouponCode(couponCode);

if (isValid) {
  // Apply coupon code logic
  console.log("Coupon code is valid");
  updateCouponStatus(couponCode); // Update the coupon status
} else {
  console.log("Invalid coupon code");
}
