import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Alert, { IAlert } from './alerts.schema';
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

// Get all alerts for a user
export const getAlerts = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const features = new APIFeatures(
    Alert.find({ userId: req.user?._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const alerts = await features.query;

  // Calculate summary statistics
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const thisMonth = alerts.filter(alert => {
    const lastTriggered = alert.lastTriggered;
    if (!lastTriggered) return false;
    const now = new Date();
    const alertDate = new Date(lastTriggered);
    return alertDate.getMonth() === now.getMonth() && alertDate.getFullYear() === now.getFullYear();
  }).length;

  res.status(200).json({
    status: 'success',
    results: alerts.length,
    data: {
      alerts,
      summary: {
        totalAlerts,
        activeAlerts,
        thisMonth,
        avgResponse: '2.3h' // Mock data for now
      }
    }
  });
});

// Get a single alert
export const getAlert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alert = await Alert.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
});

// Create a new alert
export const createAlert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alertData = {
    ...req.body,
    userId: req.user?._id
  };

  const alert = await Alert.create(alertData);

  res.status(201).json({
    status: 'success',
    data: {
      alert
    }
  });
});

// Update an alert
export const updateAlert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alert = await Alert.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?._id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
});

// Delete an alert
export const deleteAlert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alert = await Alert.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Toggle alert status
export const toggleAlertStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alert = await Alert.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  alert.status = alert.status === 'active' ? 'inactive' : 'active';
  await alert.save();

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
});

// Get recent alerts (triggered alerts)
export const getRecentAlerts = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const recentAlerts = await Alert.find({
    userId: req.user?._id,
    lastTriggered: { $exists: true, $ne: null }
  })
    .sort({ lastTriggered: -1 })
    .limit(10);

  res.status(200).json({
    status: 'success',
    results: recentAlerts.length,
    data: {
      alerts: recentAlerts
    }
  });
});

// Trigger an alert (for testing or manual triggering)
export const triggerAlert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alert = await Alert.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  alert.lastTriggered = new Date();
  await alert.save();

  // Here you would typically send a notification
  // For now, we'll just log it
  logger.info(`Alert triggered: ${alert.name} for user ${req.user?._id}`);

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
}); 