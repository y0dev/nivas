import { Request, Response } from 'express';
import Waitlist, { IWaitlist } from './waitlist.schema';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export const addToWaitlist = catchAsync(async (req: Request, res: Response) => {
  const { email, featurePreference } = req.body;

  // Check if email already exists
  const existingWaitlist = await Waitlist.findOne({ email });
  if (existingWaitlist) {
    return res.status(200).json({
      status: 'success',
      message: 'You are already on our waitlist!'
    });
  }

  // Create new waitlist entry
  const waitlist = await Waitlist.create({
    email,
    featurePreference
  });

  res.status(201).json({
    status: 'success',
    message: 'Successfully added to waitlist',
    data: {
      waitlist: {
        id: waitlist._id,
        email: waitlist.email,
        featurePreference: waitlist.featurePreference,
        createdAt: waitlist.createdAt
      }
    }
  });
});

export const getWaitlistStats = catchAsync(async (req: Request, res: Response) => {
  const totalSubscribers = await Waitlist.countDocuments();
  
  // Get feature preference stats
  const featureStats = await Waitlist.aggregate([
    {
      $group: {
        _id: '$featurePreference',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get recent subscribers (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentSubscribers = await Waitlist.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalSubscribers,
      recentSubscribers,
      featureStats
    }
  });
});

export const getAllWaitlist = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const waitlist = await Waitlist.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Waitlist.countDocuments();

  res.status(200).json({
    status: 'success',
    results: waitlist.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      waitlist
    }
  });
});

export const removeFromWaitlist = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;

  const waitlist = await Waitlist.findOneAndDelete({ email });

  if (!waitlist) {
    throw new AppError('Email not found in waitlist', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully removed from waitlist'
  });
}); 