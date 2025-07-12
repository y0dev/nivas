import mongoose, { Document, Schema, Model } from "mongoose";

interface IMLS extends Document {
  mlsId: string;
  price: string;
  address: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  dateCreated?: Date;
  modifiedOn?: Date;
}

const mlsSchema: Schema<IMLS> = new Schema({
  mlsId: {
    type: String,
    required: [true, "please insert mls id"],
    minlength: 2,
    maxlength: 12,
  },
  price: {
    type: String,
    required: [true, "please insert price"],
    minlength: 2,
    maxlength: 12,
  },
  address: {
    type: String,
    required: [true, "please insert address"],
    minlength: 2,
    maxlength: 255,
  },
  city: {
    type: String,
    required: [true, "please insert city"],
    minlength: 2,
    maxlength: 255,
  },
  state: {
    type: String,
    required: [true, "please insert state"],
    minlength: 2,
    maxlength: 255,
  },
  beds: {
    type: Number,
    required: [true, "please insert number of bedrooms"],
    min: 1,
    max: 12,
  },
  baths: {
    type: Number,
    required: [true, "please insert number of bathrooms"],
    min: 1,
    max: 12,
  },
  dateCreated: {
    type: Date,
    required: false,
  },
  modifiedOn: {
    type: Date,
    required: false,
  },
});

// Middleware to set dateCreated and modifiedOn
mlsSchema.pre<IMLS>("save", function (next) {
  const now = new Date();
  if (!this.dateCreated) {
    this.dateCreated = now;
  }
  this.modifiedOn = now;
  next();
});

const MLS: Model<IMLS> = mongoose.model<IMLS>("MLS", mlsSchema);

export { MLS, mlsSchema, IMLS };
