import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Goal, { IGoal } from './goals.schema';
import APIFeatures from '../../utils/apiFeatures';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { logger } from '../../utils/logger';

// Extend Request interface to include user
interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
}

// Get all goals for a user
export const getGoals = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const features = new APIFeatures(
    Goal.find({ userId: req.user?._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const goals = await features.query;

  // Calculate summary statistics
  const totalGoals = goals.length;
  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;
  const monthlyInvestment = goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0);

  res.status(200).json({
    status: 'success',
    results: goals.length,
    data: {
      goals,
      summary: {
        totalGoals,
        activeGoals,
        avgProgress,
        monthlyInvestment
      }
    }
  });
});

// Get a single goal
export const getGoal = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!goal) {
    return next(new AppError('No goal found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      goal
    }
  });
});

// Create a new goal
export const createGoal = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const goalData = {
    ...req.body,
    userId: req.user?._id,
    progress: 0
  };

  // Calculate initial progress
  if (goalData.currentAmount > 0 && goalData.targetAmount > 0) {
    goalData.progress = Math.min((goalData.currentAmount / goalData.targetAmount) * 100, 100);
  }

  const goal = await Goal.create(goalData);

  res.status(201).json({
    status: 'success',
    data: {
      goal
    }
  });
});

// Update a goal
export const updateGoal = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!goal) {
    return next(new AppError('No goal found with that ID', 404));
  }

  // Update goal data
  Object.assign(goal, req.body);

  // Recalculate progress
  if (goal.targetAmount > 0) {
    goal.progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  // Update status based on progress and target date
  const now = new Date();
  const timeRemaining = goal.targetDate.getTime() - now.getTime();
  const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

  if (goal.progress >= 100) {
    goal.status = 'completed';
  } else if (daysRemaining < 0 && goal.progress < 100) {
    goal.status = 'behind';
  } else {
    goal.status = 'active';
  }

  await goal.save();

  res.status(200).json({
    status: 'success',
    data: {
      goal
    }
  });
});

// Delete a goal
export const deleteGoal = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!goal) {
    return next(new AppError('No goal found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Update goal progress
export const updateGoalProgress = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentAmount } = req.body;

  const goal = await Goal.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!goal) {
    return next(new AppError('No goal found with that ID', 404));
  }

  goal.currentAmount = currentAmount;

  // Recalculate progress
  if (goal.targetAmount > 0) {
    goal.progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  // Update status based on progress and target date
  const now = new Date();
  const timeRemaining = goal.targetDate.getTime() - now.getTime();
  const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

  if (goal.progress >= 100) {
    goal.status = 'completed';
  } else if (daysRemaining < 0 && goal.progress < 100) {
    goal.status = 'behind';
  } else {
    goal.status = 'active';
  }

  await goal.save();

  res.status(200).json({
    status: 'success',
    data: {
      goal
    }
  });
}); 