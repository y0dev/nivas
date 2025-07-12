import { Schema, model, Document, Model } from 'mongoose';

// Interface for Coupon document
export interface ICoupon extends Document {
  code: string;
  description: string;
  expirationDate: Date;
  status: 'active' | 'expired';
  usageCount: number;
  maxUsage?: number;
}

// Interface for Coupon model
export interface ICouponModel extends Model<ICoupon> {}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  maxUsage: {
    type: Number,
  },
});

const Coupon = model<ICoupon, ICouponModel>('Coupon', couponSchema);

export { Coupon }; 