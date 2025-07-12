import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import APIFeatures from '../../utils/apiFeatures';
import {logger} from '../../utils/logger';

// Generic type for Model
type ModelType<T extends Document> = Model<T>;

// Response interface
interface ApiResponse {
  status: 'success' | 'error';
  data?: {
    document?: any;
    documents?: any[];
    data?: any;
  } | null;
}

export const deleteOne = <T extends Document>(Model: ModelType<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    } as ApiResponse);
  });

export const updateOne = <T extends Document>(Model: ModelType<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    } as ApiResponse);
  });

export const createOne = <T extends Document>(Model: ModelType<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info(JSON.stringify(req.body));

    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    } as ApiResponse);
  });

export const getAll = <T extends Document>(Model: ModelType<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        documents,
      },
    } as ApiResponse);
  });

export const getOne = <T extends Document>(Model: ModelType<T>, populateOptions?: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    } as ApiResponse);
  });

export default {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
}; 