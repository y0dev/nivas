const multer = require("multer");
const sharp = require("sharp");
const User = require("./user.schema");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const logger = require("../../utils/logger").logger;
const factory = require("../repo/repo.controller");
const UtilityService = require("../../utils/utilities");
const Payment = require("../payment/payment.schema");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    logger.error("file must be an image");
    cb(new AppError("file must be an image!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.updateUserDetails = catchAsync(async (req, res, next) => {
  logger.info("Updating user details");
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("cannot update password", 403));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      filteredBody,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      name: user.name,
      email: user.email,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  logger.info("Deleting user");
  await User.findByIdAndUpdate(req.user.id, {
    deleted: true,
    deletedDate: Date.now(),
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.newUser = (req, res) => {
  res.send("wait");
};

exports.getUser = (req, res) => {
  res.send("wait");
};

exports.purchaseCoins = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { coins } = req.body;

  // Find the user by id
  const user = await User.findById(id);

  // Update the coin bank for the user
  user.coinBank.coins += coins;

  // Save the updated user
  await user.save();

  res.status(200).json({ message: "Coins purchased successfully." });
  // Redirect the user to the signup page
  // res.redirect("/signup");
});

function get_number_of_coins(amount, purchasedItems) {
  return 0;
}

// Handle purchasing of coins Tier
exports.purchaseCoins = catchAsync(async (req, res, next) => {
  try {
    const user = req.user; // Assuming you have user information available in the request object
    const { amount, items } = req.payment;
    const numOfCoins = get_number_of_coins(amount, items);
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
      status: "success",
      message: `Purchased ${numOfCoins} number of coins`,
    });
  } catch (error) {
    next(error);
  }
});

//admin
exports.updateUser = factory.updateOne(User);
exports.deleteAsAdmin = factory.deleteOne(User);
