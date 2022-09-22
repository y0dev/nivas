import * as Mongoose from "mongoose";
import { UtilityService } from "../../../services/utility";
import { UserRepository } from "./repository";
import { IUserModel } from "./user.types";

export class UserModel {

   private _userModel: IUserModel;

   constructor(userModel: IUserModel) {
      this._userModel = userModel;
   }

   get firstName(): string {
      return this._userModel.firstName;
   }

   get lastName(): string {
      return this._userModel.lastName;
   }

   get email(): string {
      return this._userModel.email;
   }

   get password(): string {
      return this._userModel.password;
   }

   get dateCreated(): Date {
      return this._userModel.dateCreated;
   }

   get modifiedOn(): Date {
      return this._userModel.modifiedOn;
   }

   static createUser( firstName: string, lastName: string, email: string, password: string ) : Promise<T> {
      const promise = new Promise(async (resolve, reject) => {
      
         const repo = new UserRepository();
   
         const user = <IUserModel> {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: await UtilityService.hashPassword(password),
            dateCreated: new Date()
         };
         
         repo.create( user, (err, res) => {
           if (err) {
               reject(err);
           } else  {
               resolve(res);
           }
         });    
         
       });
       
       return promise;
   }

   static findUser(email: string) : Promise<T> {
      let promise = new Promise((resolve, reject) => {
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
