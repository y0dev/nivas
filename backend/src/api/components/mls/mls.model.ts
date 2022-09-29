import { privateDecrypt } from "crypto";
import { logger } from "../../../config/logger";
import { UtilityService } from "../../../services/utility";
import { MLSRepository } from "./mls.repository";
import { IMLSDocument } from "./mls.types";

export class MLSModel {

   private _mlsModel: IMLSDocument;
   public u_id: number;
   public password: string;

   constructor(mlsModel: IMLSDocument) {
      this._mlsModel = mlsModel;
   }

   get address(): string {
      return this._mlsModel.address;
   }

   get zipCode(): number {
      return this._mlsModel.zipCode;
   }

   get city(): string {
      return this._mlsModel.city;
   }

   get state(): string {
      return this._mlsModel.state;
   }

   get user_id(): string {
      return this._mlsModel.u_id;
   }

   

   static createMLS({ price, address, city, state, zipCode, user_id }) : Promise<IMLSDocument> {
      const promise = new Promise<IMLSDocument>(async (resolve, reject) => {
      
         const repo = new MLSRepository();
   
         const mls = <IMLSDocument> {
            price: price,
            address: address,
            city: city,
            state: state,
            zipCode: zipCode,
            u_id: user_id
         };

         const record = await repo.findOne({ user_id, address, zipCode });
         if (!record) {
            repo.create( mls, (err, res) => {
               if (err) {
                  reject(err);
               } else  {
                  logger.info('Created a new mls');
                  resolve(res);
               }
            }); 
         } else {
            logger.info(`MLS Record: ${mls} exists already`);
         }
         
       });
       
       return promise;
   }

   // Find all
   static findUserDocs(user_id: string, date: Date) : Promise<IMLSDocument> {
      let promise = new Promise<IMLSDocument>((resolve, reject) => {
        let repo = new MLSRepository();
  
        repo.find({ user_id : user_id }).sort({ createdAt: -1 }).exec((err, res) => {
          
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

    public static mockTestMLS(): MLSModel {
      let mlsDoc:IMLSDocument;
      // mlsDoc.firstName = 'Mike';
      // mlsDoc.lastName = 'Smith';
      // mlsDoc.email = 'mike_smith@mail.com'
      // mlsDoc.password = 'password'
      // mlsDoc.userName = 'mike_s';
		const mls = new MLSModel(mlsDoc);
		return mls;
	}

}
