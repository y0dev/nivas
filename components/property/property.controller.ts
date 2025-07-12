import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Property, { IProperty } from './property.schema';
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

// Get all saved properties for a user
export const getSavedProperties = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const features = new APIFeatures(
    Property.find({ userId: req.user?._id, isSaved: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: {
      properties
    }
  });
});

// Get all portfolio properties for a user
export const getPortfolioProperties = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const features = new APIFeatures(
    Property.find({ userId: req.user?._id, isInPortfolio: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

  // Calculate portfolio summary
  const totalValue = properties.reduce((sum, prop) => sum + (prop.currentValue || prop.price), 0);
  const totalEquity = properties.reduce((sum, prop) => sum + (prop.equity || 0), 0);
  const monthlyCashFlow = properties.reduce((sum, prop) => sum + (prop.cashFlow || 0), 0);
  const averageROI = properties.length > 0 
    ? properties.reduce((sum, prop) => sum + prop.roi, 0) / properties.length 
    : 0;

  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: {
      properties,
      summary: {
        totalValue,
        totalEquity,
        monthlyCashFlow,
        averageROI
      }
    }
  });
});

// Get a single property
export const getProperty = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Save a property
export const saveProperty = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const propertyData = {
    ...req.body,
    userId: req.user?._id,
    isSaved: true,
    savedDate: new Date()
  };

  // Check if property already exists
  const existingProperty = await Property.findOne({
    zpid: propertyData.zpid,
    userId: req.user?._id
  });

  if (existingProperty) {
    // Update existing property
    existingProperty.isSaved = true;
    existingProperty.savedDate = new Date();
    await existingProperty.save();

    return res.status(200).json({
      status: 'success',
      data: {
        property: existingProperty
      }
    });
  }

  const property = await Property.create(propertyData);

  res.status(201).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Add property to portfolio
export const addToPortfolio = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?._id
    },
    {
      isInPortfolio: true,
      purchasePrice: req.body.purchasePrice,
      currentValue: req.body.currentValue,
      monthlyExpenses: req.body.monthlyExpenses,
      equity: req.body.equity,
      mortgage: req.body.mortgage,
      occupancy: req.body.occupancy,
      appreciation: req.body.appreciation
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Remove property from saved
export const removeSavedProperty = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?._id
    },
    {
      isSaved: false
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Remove property from portfolio
export const removeFromPortfolio = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?._id
    },
    {
      isInPortfolio: false
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Update property notes
export const updatePropertyNotes = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?._id
    },
    {
      notes: req.body.notes
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      property
    }
  });
});

// Delete a property
export const deleteProperty = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const property = await Property.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!property) {
    return next(new AppError('No property found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 