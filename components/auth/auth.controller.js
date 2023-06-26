const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../user/user.schema");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const logger = require("../../utils/logger").logger;
const Email = require("../email/email.class");
const SearchHistory = require("../history/history.schema");

require("dotenv").config();

const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// Create a JWT to send to the frontend
const createAndSendToken = (user, statusCode, req, res) => {
  logger.info("Creating a token");
  const token = signToken(user._id.toString());

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  logger.info("Sending token to user");
  // logger.info(`Token: ${token}`);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  logger.info("Signing up a new user");
  const { subscription } = req.session;
  if (subscription) {
    console.log(subscription);
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.passwordConfirmation,
  });

  logger.info("Sending a welcome email to user");
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  logger.info("Logging in user");
  const { email, password } = req.body;

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
exports.protect = catchAsync(async (req, res, next) => {
  logger.info("Ensure that a valid user is logged in");
  let token = null;
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
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

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
exports.protectedViewRoutes = catchAsync(async (req, res, next) => {
  logger.info("PVR Ensure that a valid user is logged in");
  let token = null;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Grab the token which is the second element after split
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.redirect("/error");
    next();
  }

  logger.info("Decoding JWT");
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  logger.info("Search for user");
  const loggedInUser = await User.findById(decoded.id);
  if (!loggedInUser) {
    res.redirect("/error");
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

exports.logout = (req, res) => {
  logger.info("Logging user out");
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // 10 Seconds
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// for rendered pages only
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET
      );

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
exports.forgotPassword = catchAsync(async (req, res, next) => {
  logger.info("Forgot password");
  const user = await User.findOne({ email: req.body.email });

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

    res.status(200)({
      status: "message",
      message: "Your reset token has been sent to your email.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError("There was an error with resetting your password", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
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

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createAndSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  logger.info("Update password");
  const user = await User.findById(req.user.id).select("+password");

  if (await user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError("incorrect password input", 401));
  }

  user.password = req.body.updatedPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordUpdatedAt = Date.now();
  await user.save(); // do not use findbyIdAndUpdate because it will not run validations

  createAndSendToken(user, 200, req, res);
});

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    error: {
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
    },
  });
};

exports.userCount = catchAsync(async (req, res, next) => {
  logger.info("Getting Total Users");
  const user = await User.findById(req.user.id);

  if (!user.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }
  const count = await User.countDocuments();
  res.send({ status: "success", count });
});

exports.newUserCount = catchAsync(async (req, res, next) => {
  logger.info("Getting New User Count");
  const user = await User.findById(req.user.id);

  if (!user.isAdmin) {
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
  res.send({ status: "success", count });
});

exports.premiumUserCount = catchAsync(async (req, res, next) => {
  logger.info("Getting Premium Users");
  const user = await User.findById(req.user.id);

  if (!user.isAdmin) {
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
  res.send({ status: "success", count });
});

exports.searchCount = catchAsync(async (req, res, next) => {
  logger.info("Getting Users Total Search COunt");
  const user = await User.findById(req.user.id);

  if (!user.isAdmin) {
    return next(
      new AppError(
        "User is not authorized to access the requested resource",
        403
      )
    );
  }
  const count = await SearchHistory.countDocuments();
  res.send({ status: "success", count });
});
