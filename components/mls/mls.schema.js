const { Schema, model } = require("mongoose");
// import * as Mongoose from "mongoose";
// import { IUserModel } from "./user.types";

let searchTermSchema = new Schema({
  userId: {
    type: String,
    required: [true, "please insert user id"],
    min: 2,
    max: 24,
  },
  term: {
    type: String,
    required: [true, "please insert search term"],
    min: 2,
  },
  searchIds: {
    type: [String],
    required: [true, "please add return items if there are any"],
  },
  dateCreated: {
    type: Date,
    required: false,
  },
});

searchTermSchema.pre("save", async function (next) {
  let now = new Date();
  if (!this.dateCreated) {
    this.dateCreated = now;
  }
  next();
});

let mlsSchema = new Schema({
  userId: {
    type: String,
    required: [true, "please insert user id"],
    min: 2,
    max: 24,
  },
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
  numOfBeds: {
    type: Number,
    required: [true, "please insert number of bedrooms"],
    min: 1,
    max: 12,
  },
  numOfBaths: {
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

mlsSchema.pre("save", async function (next) {
  let now = new Date();
  if (!this.dateCreated) {
    this.dateCreated = now;
  }
  this.modifiedOn = now;
  next();
});

const MLS = model("MLS", mlsSchema);
const SearchTerm = model("SearchTerm", searchTermSchema);

module.exports = { MLS, SearchTerm };
