import { Document } from "mongoose";

export interface IUserModel {
   userName: string;
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

export interface IUserDocument extends IUserModel, Document  {
   fullName: string;
   dateCreated: Date;
   modifiedOn?: Date;
   // comparePassword(candidatePassword: string): Promise<Boolean>;
}
