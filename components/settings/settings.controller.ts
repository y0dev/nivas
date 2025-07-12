import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Settings, { ISettings } from './settings.schema';
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

// Get user settings
export const getSettings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let settings = await Settings.findOne({ userId: req.user?._id });

  if (!settings) {
    // Create default settings if none exist
    settings = await Settings.create({
      userId: req.user?._id,
      profile: {
        firstName: 'User',
        lastName: 'Name',
        email: req.user?.email || '',
        phone: ''
      },
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketAlerts: true,
        propertyAlerts: true,
        weeklyReports: true
      },
      preferences: {
        currency: 'USD',
        language: 'English',
        timezone: 'America/New_York',
        theme: 'light'
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Update user settings
export const updateSettings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const settings = await Settings.findOneAndUpdate(
    { userId: req.user?._id },
    req.body,
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Update profile information
export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, phone } = req.body;

  const settings = await Settings.findOneAndUpdate(
    { userId: req.user?._id },
    {
      profile: {
        firstName,
        lastName,
        email,
        phone
      }
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Update notification preferences
export const updateNotifications = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const settings = await Settings.findOneAndUpdate(
    { userId: req.user?._id },
    {
      notifications: req.body
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Update user preferences
export const updatePreferences = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const settings = await Settings.findOneAndUpdate(
    { userId: req.user?._id },
    {
      preferences: req.body
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Reset settings to default
export const resetSettings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const defaultSettings = {
    profile: {
      firstName: 'User',
      lastName: 'Name',
      email: req.user?.email || '',
      phone: ''
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketAlerts: true,
      propertyAlerts: true,
      weeklyReports: true
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      timezone: 'America/New_York',
      theme: 'light'
    }
  };

  const settings = await Settings.findOneAndUpdate(
    { userId: req.user?._id },
    defaultSettings,
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
}); 