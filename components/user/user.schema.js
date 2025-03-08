const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Payment = require("../payment/payment.schema");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
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
  billing: {
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    cardDetails: {
      cardNumber: String,
      expirationDate: String,
      cardHolder: String,
      cardType: {
        type: String,
        enum: ["VISA", "MasterCard", "AMEX", "Discover"],
      },
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Annually"],
    },
    nextBillingDate: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
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

/**
 * Property Schema
 * Represents a real estate property saved by the user.
 */
const propertySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mlsId: {
      type: String,
      required: false, // Optional for non-MLS properties
      minLength: 2,
      maxLength: 12,
    },
    address: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    city: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    state: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    zipCode: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    squareFeet: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Single Family", "Multi Family", "Condo", "Townhouse", "Land"],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    listedAt: {
      type: Date,
      default: Date.now,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

propertySchema.pre("save", function (next) {
  this.modifiedOn = new Date();
  next();
});

const Property = model("Property", propertySchema);

module.exports = { User, Property };
