import { Document } from "mongoose";

export interface IMLSModel {
   price: number;
   address: string;
   street: string;
   city: string;
   state: string;
   zipCode: number;
   beds: number;
   baths: number;
   area: string;
   url: string;
}

export interface IMLSDocument extends IMLSModel, Document  {
   u_id: string;
   dateSearched?: Date;
}
