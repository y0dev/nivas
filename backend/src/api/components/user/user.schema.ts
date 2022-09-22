import * as Mongoose from "mongoose";
import { IUserModel } from "./user.types";


let schema = new Mongoose.Schema({
   userName: {
      type: String,
      required: true,
      min: 2,
      max: 32
   },
   firstName: {
      type: String,
      required: true,
      min: 2,
      max: 255
   },
   lastName: {
      type: String,
      required: true,
      min: 2,
      max: 255
   },
   email: {
      type: String,
      required: true,
      min: 6,
      max: 255
   },
   password: {
      type: String,
      required: true,
      min: 8,
      max: 28
   },
   dateCreated: {
      type: Date,
      required: true
   },
   modifiedOn: {
      type: Date,
      required: false
   }
 }).pre('save', function(next) {
   if (this._doc) {
     let doc = <IUserModel>this._doc;
     let now = new Date();
     if (!doc.dateCreated) {
       doc.dateCreated = now;
     }
     doc.modifiedOn = now;
   }
   next();
   return this;
 });

export const UserSchema = Mongoose.model<IUserModel>('user', schema );