const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../user/user.schema");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Email = require("../email/email.class");

require("dotenv").config();

const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// Create a JWT to send to the frontend
const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id.toString());
  console.log(token);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  console.log(token);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.passwordConfirmation,
  });

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(user, 200, req, res);
});

// Ensure that a valid user is logged in
exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You must be logged in"), 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

  const loggedInUser = await User.findById(decoded.id);
  if (!loggedInUser) {
    return next(new AppError("This user no longer exists.", 401));
  }

  if (loggedInUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("You must be logged in", 401));
  }

  req.user = loggedInUser;
  res.locals.user = loggedInUser;
  next();
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.noe() + 10 * 1000),
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
exports.forgotPassword = async (req, res, next) => {
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
};

exports.resetPassword = catchAsync(async (req, res, next) => {
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
