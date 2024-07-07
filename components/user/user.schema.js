const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Payment = require("../payment/payment.schema");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    maxlength: 30,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  username: {
    type: String,
    required: [true, "User must have a username"],
    maxlength: 30,
    minlength: 2,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      // This only works on CREATE and SAVE, not on UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password do not match",
    },
    select: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  passwordUpdatedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
  deletedDate: Date,
  cookieConsent: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  searchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "SearchHistory",
    },
  ],
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("Saving user");
  // Generate a salt with 10 rounds of hashing
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  // Set password creation date if it's not already set
  if (!this.passwordCreatedAt) {
    this.passwordCreatedAt = new Date();
  }

  this.confirmPassword = undefined;
  next();
});

// Define a pre hook to update the deleted property
userSchema.pre("findByIdAndUpdate", async function (next) {
  // Access the document being updated
  const docToUpdate = await this.model.findById(this.getQuery());

  // Check if the document exists and update the deleted property
  if (docToUpdate) {
    docToUpdate.deleted = true;
    await docToUpdate.save();
  }

  // Proceed to the next middleware
  next();
});

// Methods to handle password verification and resetting
userSchema.methods.verifyPassword = async function (password) {
  try {
    // Compare the input password with the stored hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordUpdatedAt) {
    const updated = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);

    return JWTTimestamp < updated;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model("User", userSchema);

module.exports = { User };
