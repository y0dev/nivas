import { Document } from "mongoose";

export interface IUserModel extends Document  {
   userName: string;
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   dateCreated: Date;
   modifiedOn?: Date;
}
