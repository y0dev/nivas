// Interface for coupon data
interface CouponData {
  expirationDate: Date;
  status: 'active' | 'expired';
  usageCount: number;
}

// Interface for coupon status
interface CouponStatus {
  expirationDate: Date;
  status: 'active' | 'expired';
  usageCount: number;
}

export class CouponStatusTracker {
  private coupons: Map<string, CouponData>;

  constructor() {
    this.coupons = new Map();
  }

  addCoupon(code: string, expirationDate: Date): void {
    this.coupons.set(code, {
      expirationDate,
      status: 'active',
      usageCount: 0,
    });
  }

  expireCoupon(code: string): void {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code)!;
      coupon.status = 'expired';
    }
  }

  incrementUsageCount(code: string): void {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code)!;
      coupon.usageCount++;
    }
  }

  getCouponStatus(code: string): CouponStatus | null {
    if (this.coupons.has(code)) {
      const coupon = this.coupons.get(code)!;
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

export class CouponValidator {
  private validCodes: Set<string>;

  constructor() {
    this.validCodes = new Set();
  }

  addValidCode(code: string): void {
    this.validCodes.add(code);
  }

  removeValidCode(code: string): void {
    this.validCodes.delete(code);
  }

  isValidCode(code: string): boolean {
    return this.validCodes.has(code);
  }
}

// Function to generate a random coupon code with a word related to "home"
export function generateCouponCode(length: number): string {
  const word = 'HOME';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const wordIndex = Math.floor(Math.random() * (length - word.length));

  let code = '';
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