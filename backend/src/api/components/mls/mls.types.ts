import { Document } from "mongoose";

export interface Position {
   latitude: number,
   longitude: number,
}
export interface PropertyModel {
   price: number;
   priceStr?: string;
   address: string;
   city: string;
   state: string;
   zipCode: number;
   beds: number;
   baths: number;
   position?: Position;
}

export interface ComparableModel {
   zpid: number;
   monthlyRent: string;
   bubblePrice: string;
   sqft: string;
   pricePerSqft: string;
   street: string;
   city: string;
   state: string;
   zipCode: number;
   beds: number;
   baths: number;
   position: Position;
}

export interface Comparables {
   minPrice: number;
   maxPrice: number;
   averagePrice: number;
   percentile25th: number;
   percentile50th: number;
   percentile75th: number;
   properties: ComparableModel[];
}

export interface IMLSModel extends PropertyModel {
   street: string;
   area: number;
   url: string;
   status: string;
   zpid: number;
   /* Percentage Prices */
   percentile25th: number;
   percentile50th: number;
   percentile75th: number;
}

export interface IMLSDocument extends IMLSModel, Document  {
   u_id: string;
   dateSearched?: Date;
}
