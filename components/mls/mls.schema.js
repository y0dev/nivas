const { Schema, model } = require("mongoose");

const mlsSchema = new Schema({
  mlsId: {
    type: String,
    required: [true, "please insert mls id"],
    min: 2,
    max: 12,
  },
  price: {
    type: String,
    required: [true, "please insert price"],
    min: 2,
    max: 12,
  },
  address: {
    type: String,
    required: [true, "please insert address"],
    min: 2,
    max: 255,
  },
  city: {
    type: String,
    required: [true, "please insert city"],
    min: 2,
    max: 255,
  },
  state: {
    type: String,
    required: [true, "please insert state"],
    min: 2,
    max: 255,
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
});

mlsSchema.pre("save", async function (next) {
  let now = new Date();
  if (!this.dateCreated) {
    this.dateCreated = now;
  }
  this.modifiedOn = now;
  next();
});

const MLS = model("MLS", mlsSchema);

module.exports = { MLS, mlsSchema };
