import * as Mongoose from "mongoose";
import { logger } from "../../../config/logger";
import { UtilityService } from "../../../services/utility";
import { UserRepository } from "./repository";
import { IUserDocument } from "./user.types";

export class UserModel {

   private _userModel: IUserDocument;

   constructor(userModel: IUserDocument) {
      this._userModel = userModel;
   }

   get username(): string {
      return this._userModel.userName;
   }

   get firstName(): string {
      return this._userModel.firstName;
   }

   get lastName(): string {
      return this._userModel.lastName;
   }

   get fullName(): string {
      return this._userModel.fullName;
   }

   get email(): string {
      return this._userModel.email;
   }

   // get password(): string {
   //    return this._userModel.password;
   // }

   // get dateCreated(): Date {
   //    return this._userModel.dateCreated;
   // }

   // get modifiedOn(): Date {
   //    return this._userModel.modifiedOn;
   // }

   static createUser({ userName, firstName, lastName, email, password }) : Promise<IUserDocument> {
      const promise = new Promise<IUserDocument>(async (resolve, reject) => {
      
         const repo = new UserRepository();
   
         const user = <IUserDocument> {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: await UtilityService.hashPassword(password)
         };
         const record = await repo.findOne({ email });
         if (!record) {
            repo.create( user, (err, res) => {
               if (err) {
                   reject(err);
               } else  {
                   logger.info('Created a new user');
                   resolve(res);
               }
            }); 
         } else {
            logger.info(`Email: ${email} exists already`);
         }
         
       });
       
       return promise;
   }

   static findUser(email: string) : Promise<IUserDocument> {
      let promise = new Promise<IUserDocument>((resolve, reject) => {
        let repo = new UserRepository();
  
        repo.find({ email : email }).sort({ createdAt: -1 }).limit(1).exec((err, res) => {
          
         if (err) {
            reject(err);
         } else {
            if (res.length) {
              resolve(res[0]);
            } else {
              resolve(null);
            }
         }
        });
      });
      
      return promise;    
    }

}
