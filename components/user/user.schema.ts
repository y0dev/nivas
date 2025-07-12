import { Schema, model, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Payment } from '../payment/payment.schema';

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  photo: string;
  password: string;
  confirmPassword?: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
  subscriptionDate?: Date;
  createdOn: Date;
  isAdmin: boolean;
  passwordUpdatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  deleted: boolean;
  deletedDate?: Date;
  transactions: Schema.Types.ObjectId[];
  searchHistory: Schema.Types.ObjectId[];
  passwordCreatedAt?: Date;
  
  // Methods
  verifyPassword(password: string): Promise<boolean>;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changePasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

// Interface for User model
export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    maxlength: 30,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, 'user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'user must have a username'],
    maxlength: 30,
    minlength: 2,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'please provide a valid password'],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm password'],
    validate: {
      // this only works on create and save not update
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: 'password and confirm password do not match',
    },
    select: false,
  },
  subscriptionTier: {
    type: String,
    default: 'free',
    required: true,
    enum: ['free', 'basic', 'premium'],
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
      ref: 'Payment',
    },
  ],
  searchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SearchHistory',
    },
  ],
});

userSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password')) return next();

  console.log('saving user');
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
userSchema.pre('findByIdAndUpdate', async function (this: any, next) {
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

userSchema.methods.verifyPassword = async function (this: IUser, password: string): Promise<boolean> {
  try {
    // Compare the input password with the stored hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (this: IUser, JWTTimestamp: number): boolean {
  if (this.passwordUpdatedAt) {
    const updated = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);

    return JWTTimestamp < updated;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (this: IUser): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model<IUser, IUserModel>('User', userSchema);

export { User }; 