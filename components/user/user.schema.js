const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Payment = require("../payment/payment.schema");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
    maxlength: 30,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "please provide a valid password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
    validate: {
      // this only works on create and save not update
      validator: function (el) {
        return el === this.password;
      },
      message: "password and confirm password do not match",
    },
    select: false,
  },
  subscriptionTier: {
    type: String, // or any other appropriate data type
    default: "free",
    required: true,
    enum: ["free", "basic", "premium"],
  },
  subscriptionDate: {
    type: Date,
    default: null,
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("saving user");
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

userSchema.methods.verifyPassword = async function (password) {
  try {
    // Compare the input password with the stored hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
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
