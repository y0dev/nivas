import * as Mongoose from "mongoose";
import { IMLSDocument } from "./mls.types";


let schema = new Mongoose.Schema({
   price: {
      type: Number,
      required: true,
      min: 2,
      max: 5
   },
   address: {
      type: String,
      required: true,
      min: 2,
      max: 32
   },
   city: {
      type: String,
      required: true,
      min: 2,
      max: 32
   },
   state: {
      type: String,
      required: true,
      min: 2,
      max: 255
   },
   zip_code: {
      type: Number,
      required: true,
      min: 2,
      max: 5
   },
   beds: {
      type: Number,
      required: true,
      min: 1,
      max: 2
   },
   baths: {
      type: Number,
      required: true,
      min: 1,
      max: 2
   },
   user_id: {
      type: String,
      required: true
   },
   url: {
      type: String,
      required: true
   },
   dateSearched: {
      type: Date,
      required: false
   }
 });

schema.pre('save', function(next) {
   if (this._doc) {
      let doc = <IMLSDocument>this._doc;
      let now = new Date();
      if (!doc.dateSearched) {
        doc.dateSearched = now;
      }

    }
    next();
    return this;
});

export const MLSSchema = Mongoose.model<IMLSDocument>('mls', schema );