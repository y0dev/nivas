import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContribution: number;
  type: 'Portfolio Value' | 'Monthly Cash Flow' | 'Property Count' | 'ROI Percentage';
  status: 'active' | 'completed' | 'behind';
  progress: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  monthlyContribution: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['Portfolio Value', 'Monthly Cash Flow', 'Property Count', 'ROI Percentage']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'behind'],
    default: 'active'
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, type: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema); 