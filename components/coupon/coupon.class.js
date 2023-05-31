class CouponStatusTracker {
  constructor() {
    this.coupons = new Map();
  }

  addCoupon(code, expirationDate) {
    this.coupons.set(code, {
      expirationDate,
      status: "active",
      usageCount: 0,
    });
  }

  expireCoupon(code) {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code);
      coupon.status = "expired";
    }
  }

  incrementUsageCount(code) {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code);
      coupon.usageCount++;
    }
  }

  getCouponStatus(code) {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code);
      const { expirationDate, status, usageCount } = coupon;
      return {
        expirationDate,
        status,
        usageCount,
      };
    }
    return null;
  }
}

class CouponValidator {
  constructor() {
    this.validCodes = new Set();
  }

  addValidCode(code) {
    this.validCodes.add(code);
  }

  removeValidCode(code) {
    this.validCodes.delete(code);
  }

  isValidCode(code) {
    return this.validCodes.has(code);
  }
}

// Function to generate a random coupon code with a word related to "home"
function generateCouponCode(length) {
  const word = "HOME";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const wordIndex = Math.floor(Math.random() * (length - word.length));

  let code = "";
  for (let i = 0; i < length; i++) {
    if (i >= wordIndex && i < wordIndex + word.length) {
      code += word.charAt(i - wordIndex);
    } else {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  }

  return code;
}

module.exports = {
  CouponStatusTracker,
  CouponValidator,
  generateCouponCode,
};
