import { promisify } from "util";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../user/user.schema";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import logger from "../../utils/logger";
import Email from "../email/email.class";
import SearchHistory from "../history/history.schema";

require("dotenv").config();

// Extend Express Request interface to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      session: {
        authorized?: boolean;
        authorization?: string;
        subscription?: any;
        destroy: () => void;
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

// Request body interfaces
interface SignUpBody {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  password: string;
  confirmPassword: string;
}

interface UpdatePasswordBody {
  passwordCurrent: string;
  updatedPassword: string;
  confirmPassword: string;
}

// Response interfaces
interface AuthResponse {
  status: "success" | "error";
  token?: string;
  message?: string;
  count?: number;
}

interface ErrorResponse {
  status: "error";
  error: {
    statusCode: number;
    message: string;
  };
}

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.SECRET_KEY!, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// Create a JWT to send to the frontend
const createAndSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response
): void => {
  logger.info("Creating a token");
  const token = signToken(user._id.toString());

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  logger.info("Saving session data");
  req.session.authorized = true;
  req.session.authorization = `Bearer ${token}`;

  console.log(req.session);
  logger.info("Sending token to user");
  // logger.info(`Token: ${token}`);
  res.status(statusCode).json({
    status: "success",
    token,
  } as AuthResponse);
};

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Signing up a new user");
  const { subscription } = req.session;
  if (subscription) {
    console.log(subscription);
  }

  const body = req.body as SignUpBody;
  const newUser = await User.create({
    name: body.name,
    email: body.email,
    username: body.username,
    password: body.password,
    confirmPassword: body.passwordConfirmation,
  });

  logger.info("Sending a welcome email to user");
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Logging in user");
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  logger.info("Searching for user in database");
  const user = await User.findOne({ email }).select("+password");

  logger.info("Validating user credentials");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(user, 200, req, res);
});

// Ensure that a valid user is logged in
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Ensure that a valid user is logged in");
  let token: string | null = null;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Grab the token which is the second element after split
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You must be logged in", 401));
  }

  logger.info("Decoding JWT");
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY!) as JWTPayload;

  logger.info("Search for user");
  const loggedInUser = await User.findById(decoded.id);
  if (!loggedInUser) {
    return next(new AppError("This user no longer exists.", 401));
  }

  logger.info("Found user");
  if (loggedInUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("You must be logged in", 401));
  }

  req.user = loggedInUser;
  res.locals.user = loggedInUser;
  next();
});

// Ensure that a valid user is logged in
export const protectedViewRoutes = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("PVR Ensure that a valid user is logged in");
  let token: string | null = null;
  // console.log(req.headers);
  console.log(req.session);
  if (
    req.session.authorization &&
    req.session.authorization.startsWith("Bearer")
  ) {
    // Grab the token which is the second element after split
    token = req.session.authorization.split(" ")[1];
  }

  if (!token) {
    res.redirect("/login");
    next();
  }

  logger.info("Decoding JWT");
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY!) as JWTPayload;

  logger.info("Search for user");
  const loggedInUser = await User.findById(decoded.id);
  if (!loggedInUser) {
    res.redirect("/login");
    next();
  }

  logger.info("Found user");
  if (loggedInUser.changePasswordAfter(decoded.iat)) {
    res.redirect("/error");
    next();
  }

  req.user = loggedInUser;
  res.locals.user = loggedInUser;
  next();
});

export const logout = (req: Request, res: Response): void => {
  logger.info("Logging user out");
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // 10 Seconds
    httpOnly: true,
  });
  req.session.destroy();
  res.status(200).json({ status: "success" } as AuthResponse);
};

// for rendered pages only
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET!
      ) as JWTPayload;

      const loggedInUser = await User.findById(decoded.id);
      if (!loggedInUser) {
        return next();
      }

      if (loggedInUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = loggedInUser;
      return next();
    } catch {
      return next();
    }
  }
  next();
};

// eslint-disable-next-line prettier/prettier
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Forgot password");
  const { email } = req.body as ForgotPasswordBody;
  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError("There is no user with that email address.", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Visit ${resetURL} if you did not request a password reset link please
  contact our privacy and security team in order to make sure your account is secure.`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token',
    //   message,
    // });

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "message",
      message: "Your reset token has been sent to your email.",
    } as AuthResponse);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError("There was an error with resetting your password", 500)
    );
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Reset password");
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid"));
  }

  const body = req.body as ResetPasswordBody;
  user.password = body.password;
  user.confirmPassword = body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createAndSendToken(user, 200, req, res);
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Update password");
  const user = await User.findById(req.user!.id).select("+password");

  const body = req.body as UpdatePasswordBody;
  if (await user!.correctPassword(body.passwordCurrent, user!.password)) {
    return next(new AppError("incorrect password input", 401));
  }

  user!.password = body.updatedPassword;
  user!.confirmPassword = body.confirmPassword;
  user!.passwordUpdatedAt = Date.now();
  await user!.save(); // do not use findbyIdAndUpdate because it will not run validations

  createAndSendToken(user!, 200, req, res);
});

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    error: {
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
    },
  } as ErrorResponse);
};

export const userCount = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Getting Total Users");
  const user = await User.findById(req.user!.id);

  if (!user!.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }
  const count = await User.countDocuments();
  res.send({ status: "success", count } as AuthResponse);
});

export const newUserCount = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Getting New User Count");
  const user = await User.findById(req.user!.id);

  if (!user!.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }

  // Get the current date
  const currentDate = new Date();

  // Get the start of the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the start of the next month
  const startOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  // Define the criteria
  const criteria = {
    createdOn: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  };

  const count = await User.countDocuments(criteria);
  res.send({ status: "success", count } as AuthResponse);
});

export const premiumUserCount = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Getting Premium Users");
  const user = await User.findById(req.user!.id);

  if (!user!.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }

  // Define the criteria
  const criteria = {
    subscriptionTier: {
      $eq: "premium",
    },
  };
  const count = await User.countDocuments(criteria);
  res.send({ status: "success", count } as AuthResponse);
});

export const searchCount = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Getting Users Total Search COunt");
  const user = await User.findById(req.user!.id);

  if (!user!.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }
  const count = await SearchHistory.countDocuments();
  res.send({ status: "success", count } as AuthResponse);
}); 