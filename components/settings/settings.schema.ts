import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketAlerts: boolean;
    propertyAlerts: boolean;
    weeklyReports: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    },
    marketAlerts: {
      type: Boolean,
      default: true
    },
    propertyAlerts: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    language: {
      type: String,
      default: 'English',
      enum: ['English', 'Spanish', 'French', 'German']
    },
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
SettingsSchema.index({ userId: 1 });

export default mongoose.model<ISettings>('Settings', SettingsSchema); 