const { Mongoose } = require("mongoose");
// import * as Mongoose from "mongoose";
// import { IUserModel } from "./user.types";

let schema = new Mongoose.Schema({
  mlsId: {
    type: String,
    required: true,
    min: 2,
    max: 12,
  },
  askingPrice: {
    type: String,
    required: true,
    min: 2,
    max: 12,
  },
  address: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  city: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  state: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  numOfBeds: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  numOfBaths: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  modifiedOn: {
    type: Date,
    required: false,
  },
});

//     .pre('save', function (next) {
//    if (this._doc) {
//      let doc = <IUserModel>this._doc;
//      let now = new Date();
//      if (!doc.dateCreated) {
//        doc.dateCreated = now;
//      }
//      doc.modifiedOn = now;
//    }
//    next();
//    return this;
//  });

const MLSSchema = conn.model("MLS", schema);

module.exports = MLSSchema;
