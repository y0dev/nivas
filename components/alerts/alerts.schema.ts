import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  name: string;
  type: 'Price Alert' | 'ROI Alert' | 'Market Alert' | 'Property Alert';
  location: string;
  condition: string;
  status: 'active' | 'inactive';
  lastTriggered: Date;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  userId: mongoose.Types.ObjectId;
  criteria: {
    minPrice?: number;
    maxPrice?: number;
    minROI?: number;
    maxROI?: number;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Price Alert', 'ROI Alert', 'Market Alert', 'Property Alert']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastTriggered: {
    type: Date,
    default: null
  },
  frequency: {
    type: String,
    required: true,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criteria: {
    minPrice: {
      type: Number,
      min: 0
    },
    maxPrice: {
      type: Number,
      min: 0
    },
    minROI: {
      type: Number,
      min: 0,
      max: 100
    },
    maxROI: {
      type: Number,
      min: 0,
      max: 100
    },
    propertyType: {
      type: String,
      trim: true
    },
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    location: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
AlertSchema.index({ userId: 1, status: 1 });
AlertSchema.index({ userId: 1, type: 1 });
AlertSchema.index({ status: 1, lastTriggered: 1 });

export default mongoose.model<IAlert>('Alert', AlertSchema); 