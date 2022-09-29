import axios from 'axios';
import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { UtilityService } from '../../../services/utility';
import { MLSModel } from './mls.model';

import { MLSRepository } from './mls.repository';
import { IMLSDocument } from './mls.types';


let url_headers = {
   'accept': '*/*',
   'accept-language': 'en-US,en;q=0.9',
   'sec-fetch-dest': 'empty',
   'sec-fetch-mode': 'cors',
   'sec-fetch-site': 'same-origin',
   // 'sec-ch-ua': '\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"',
   'sec-ch-ua-mobile': '?0',
   // 'sec-ch-ua-platform': '\"macOS\"',
   'user-agent': ''
}


export class MLSController {

	private readonly repo: MLSRepository = new MLSRepository();
   
	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getZillow(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
         // const { user_agent } = req.header;
         console.log(req.header);
         
			const { city, state, zip_code, user_id } = req.body;
         // let url: string;
         // const url = (city !== undefined && state !== undefined) ? `https://www.zillow.com/homes/${city},-${state}_rb/` :
         // ``;
         if( city !== undefined && state !== undefined )
         {
            
            //`https://www.zillow.com/homes/${city},-${state}_rb/`;
         }
         else if( zip_code !== undefined )
         {
            
         }
         // url_headers['user-agent'] = user_agent;
         const [google_city, google_state] = ['McKinney','TX'];
         const [north,south,east,west] = UtilityService.getBoundingBox([33.197960,-96.615021],1);
         const url =  `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{},"usersSearchTerm":"${google_city}, ${google_state}","mapBounds":{"north":${north},"south":${south},"east":${east},"west":${west}},"regionSelection":[{"regionId":12292,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=6`
         let numOfPages: number;

         await axios.get(
            url,
            {
               headers: url_headers,
            },
         ).then( (res) => {
            const cat1 = res.data.cat1;
            if (cat1)
            {
               numOfPages = cat1.searchList.totalPages;
            }
            else 
            {
               UtilityService.handleError('cat1 does not exist!')
            }
         });

         let results = [];
         for (let idx = 1; idx <= numOfPages; idx++) {
            const url =  `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${idx}},"usersSearchTerm":"${google_city}, ${google_state}","mapBounds":{"north":${north},"south":${south},"east":${east},"west":${west}},"regionSelection":[{"regionId":12292,"regionType":6}],"isMapVisible":true,"filterState":{"sortSelection":{"value":"days"},"isAllHomes":{"value":true}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=6`
            await axios.get(
               url,
               {
                  headers: url_headers,
               },
            ).then( (res) => {
               const cat1 = res.data.cat1;
               if (cat1)
               {
                  cat1.listResults.forEach(element => {
                     results.push({
                        price: element.price,
                        address: element.address,
                        street: element.addressStreet,
                        city: element.addressCity,
                        state: element.addressState,
                        zipCode: element.addressZipcode,
                        beds: element.beds,
                        baths: element.baths,
                        area: element.area,
                        url: element.detailUrl
                     })
                  });
               }
               else 
               {
                  UtilityService.handleError('cat1 does not exist!')
               }
            });       
         }

         let docs: IMLSDocument[] = [];

         results.forEach(async (result) => {
            const existingMLS: MLSModel | undefined = await this.repo.find({
               address: result.address,
               city: result.city,
               state: result.state,
               zipCode: result.zipCode
            });
            if (!existingMLS) {
               const mls: IMLSDocument = await MLSModel.createMLS({
                  price: result.price,
                  address: result.address,
                  city: result.city,
                  state: result.state,
                  zipCode: result.zipCode,
                  user_id: user_id
               });
               docs.push(mls);
            }
         });

         return res.json(docs);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Register new user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async retrieveSearches(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { user_id } = req.params;
			const { email } = req.body;

			const mlsDoc: IMLSDocument | undefined = await this.getUserSearches(user_id, email);

			if (!mlsDoc) {
				return res.status(403).json({ error: 'Invalid U_ID' });
			}

			return res.status(200).json(mlsDoc);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Get user invitation
	 *
	 * @param u_id
	 * @param email
	 * @returns User invitation
	 */
	@bind
	private async getUserSearches(u_id: string, email: string): Promise<IMLSDocument | undefined> {
		try {
			return this.repo.find({ u_id: u_id, email: email });
		} catch (err) {
			throw err;
		}
	}
}