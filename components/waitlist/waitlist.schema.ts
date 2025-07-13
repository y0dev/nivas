import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlist extends Document {
  email: string;
  featurePreference: string;
  createdAt: Date;
  updatedAt: Date;
}

const waitlistSchema = new Schema<IWaitlist>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  featurePreference: {
    type: String,
    required: [true, 'Feature preference is required'],
    enum: [
      'Property Search & Discovery',
      'ROI Calculator',
      'Market Analysis',
      'Portfolio Tracking',
      'Investment Alerts',
      'Property Management',
      'Financial Planning Tools',
      'Community & Networking'
    ]
  }
}, {
  timestamps: true
});

// Index for faster queries
waitlistSchema.index({ email: 1 });
waitlistSchema.index({ createdAt: -1 });

export default mongoose.model<IWaitlist>('Waitlist', waitlistSchema); 