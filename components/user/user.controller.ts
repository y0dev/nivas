import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { User, IUser } from './user.schema';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import logger from '../../utils/logger';
import factory from '../repo/repo.controller';
import UtilityService from '../../utils/utilities';
import { Payment } from '../payment/payment.schema';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File;
    }
  }
}

// Request body interfaces
interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PurchaseCoinsBody {
  coins?: number;
  amount?: number;
  items?: any[];
}

// Response interfaces
interface UserResponse {
  status: 'success' | 'error';
  data?: {
    users?: IUser[];
    name?: string;
    email?: string;
  };
  message?: string;
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    logger.error('file must be an image');
    cb(new AppError('file must be an image!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const resizeUserPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user!.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

export const uploadUserPhoto = upload.single('photo');

const filterObj = (obj: any, ...allowedFields: string[]): any => {
  const newObj: any = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  } as UserResponse);
});

export const updateUserDetails = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info('Updating user details');
  const filteredBody = filterObj(req.body as UpdateUserBody, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('cannot update password', 403));
  }

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    {
      filteredBody,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      name: user!.name,
      email: user!.email,
    },
  } as UserResponse);
});

export const getMe = (req: Request, res: Response, next: NextFunction): void => {
  req.params.id = req.user!.id;
  next();
};

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info('Deleting user');
  await User.findByIdAndUpdate(req.user!.id, {
    deleted: true,
    deletedDate: Date.now(),
  });

  res.status(204).json({
    status: 'success',
    data: null,
  } as UserResponse);
});

export const newUser = (req: Request, res: Response): void => {
  res.send('wait');
};

export const getUser = (req: Request, res: Response): void => {
  res.send('wait');
};

export const purchaseCoins = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.user!;
  const { coins } = req.body as PurchaseCoinsBody;

  // Find the user by id
  const user = await User.findById(id);

  // Update the coin bank for the user
  user!.coinBank.coins += coins!;

  // Save the updated user
  await user!.save();

  res.status(200).json({ message: 'Coins purchased successfully.' });
  // Redirect the user to the signup page
  // res.redirect("/signup");
});

function get_number_of_coins(amount: number, purchasedItems: any[]): number {
  return 0;
}

// Handle purchasing of coins Tier
export const purchaseCoinsTier = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user!; // Assuming you have user information available in the request object
    const { amount, items } = req.body as PurchaseCoinsBody;
    const numOfCoins = get_number_of_coins(amount!, items!);
    const transaction = new Payment({
      user: user._id,
      amount,
      numberOfCoins: numOfCoins,
    });

    await transaction.save();

    // Add the transaction to the user's transactions array
    await User.findByIdAndUpdate(user._id, {
      $push: { transactions: transaction._id },
    });

    res.status(200).json({
      status: 'success',
      message: `Purchased ${numOfCoins} number of coins`,
    } as UserResponse);
  } catch (error) {
    next(error);
  }
});

//admin
export const updateUser = factory.updateOne(User);
export const deleteAsAdmin = factory.deleteOne(User); 