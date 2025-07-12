import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  zpid: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  priceStr: string;
  monthlyRent: number;
  roi: number;
  cashFlow: number;
  score: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  status: string;
  image: string;
  notes?: string;
  savedDate: Date;
  userId: mongoose.Types.ObjectId;
  isSaved: boolean;
  isInPortfolio: boolean;
  purchasePrice?: number;
  currentValue?: number;
  monthlyExpenses?: number;
  equity?: number;
  mortgage?: number;
  occupancy?: number;
  appreciation?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  zpid: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceStr: {
    type: String,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  roi: {
    type: Number,
    required: true
  },
  cashFlow: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  sqft: {
    type: Number,
    required: true
  },
  yearBuilt: {
    type: Number,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['For Sale', 'Sold', 'Rented', 'Available']
  },
  image: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  savedDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  isInPortfolio: {
    type: Boolean,
    default: false
  },
  purchasePrice: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  monthlyExpenses: {
    type: Number
  },
  equity: {
    type: Number
  },
  mortgage: {
    type: Number
  },
  occupancy: {
    type: Number,
    min: 0,
    max: 100
  },
  appreciation: {
    type: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PropertySchema.index({ userId: 1, isSaved: 1 });
PropertySchema.index({ userId: 1, isInPortfolio: 1 });
PropertySchema.index({ zpid: 1 });

export default mongoose.model<IProperty>('Property', PropertySchema); 