import axios from 'axios';
import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../../../config/logger';
import { UtilityService } from '../../../services/utility';
import { MLSModel } from './mls.model';

import { MLSRepository } from './mls.repository';
import { IMLSModel, IMLSDocument } from './mls.types';


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

const time = 1;

export class MLSController {

	private readonly repo: MLSRepository = new MLSRepository();
   
	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getZillowByCity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
         url_headers['user-agent'] = req.get('user-agent');
         
         // logger.info(url_headers['user-agent']);
			const { city, state, user_id } = req.body;
         
         logger.info('Grabbing number of pages to check');

         const map_bounds:string = await this.retrieveCityStateSearchParameters(city,state);
         
         await UtilityService.sleep(time);  

         const searchTerm = `"${city}, ${state}"`.toLowerCase();
         const numOfPages: number = await this.retrieveNumberOfPages(searchTerm,map_bounds);

         await UtilityService.sleep(time);  
         logger.info('Grabbing data from zillow');
         let results = await this.retrieveResults(searchTerm,numOfPages,map_bounds);
         

         return res.json(results);
         let docs: IMLSDocument[] = [];

         logger.info('Saving data to database');
         results.forEach(async (result) => {
            const existingMLS: MLSModel | undefined = await this.repo.find({
               address: result['address'],
               city: result['city'],
               state: result['state'],
               zipCode: result['zipCode']
            });
            if (!existingMLS) {
               const mls: IMLSDocument = await MLSModel.createMLSDoc({
                  price: result['price'],
                  address: result['address'],
                  city: result['city'],
                  state: result['state'],
                  zipCode: result['zipCode'],
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
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getZillowByZipCode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {

			const { zipcode } = req.params;
         const { user_id } = req.body;

         url_headers['user-agent'] = req.get('user-agent');
         const cleanZipCode = parseInt(zipcode).toString();

         logger.info('Grabbing search parameters');
         const map_bounds:string = await this.retrieveZipCodeSearchParameters(cleanZipCode);

         await UtilityService.sleep(time);  

         logger.info('Grabbing number of pages to check');
         const searchTerm = `"${cleanZipCode}"`;
         const numOfPages: number = await this.retrieveNumberOfPages(searchTerm,map_bounds);

         logger.info('Grabbing data from zillow');
         let results = await this.retrieveResults(searchTerm,numOfPages,map_bounds);


         let docs: IMLSModel[] = [];

         logger.info('Saving data to database');
         // results.forEach(async (result) => {

         //    const existingMLS: MLSModel[] | undefined = await this.repo.find({
         //       address: result['address'],
         //       city: result['city'],
         //       state: result['state'],
         //       zipCode: result['zipCode'],
         //       user_id: user_id
         //    });
            // console.log(existingMLS.length);
            
         //    if (existingMLS.length === 0) {
               
         //       const mls: IMLSModel = await MLSModel.createMLS({
         //          price: result['price'],
         //          priceStr: result['priceStr'],
         //          address: result['address'],
         //          street: result['street'],
         //          city: result['city'],
         //          state: result['state'],
         //          zipCode: result['zipCode'],
         //          beds: result['beds'],
         //          baths: result['baths'],
         //          area: result['area'],
         //          url: result['url'],
         //          status: result['status']
         //       });
         //       docs.push(mls);
         //    }
         // });
         
         return res.json({'results':results})
      }
      catch (err) {
         return next(err);
      }
   }

   /**
	 * Get the parameters needed to search Zillow
	 *
	 * @param zip_code Zip Code of place
	 * @returns Parameters to search Zillow
	 */
    private async retrieveZipCodeSearchParameters(zip_code:string): Promise<string | undefined> {
      try 
      {
         const region_url = `https://www.zillow.com/homes/${zip_code}/`;
         return await axios.get(
            region_url,
            {
               headers: url_headers,
            },
         ).then((res) => {
            const data = res.data;
            const position = data.search(/"queryState"/);
            const bounds = data.substring(
                  position + 14, 
                  data.lastIndexOf('7}]') + 3
            );
            
            return bounds;
         });
      } catch (err) {
			throw err;
      }
   }

   /**
	 * Get the parameters needed to search Zillow
	 *
	 * @param city
	 * @param state
	 * @returns Parameters to search Zillow
	 */
   private async retrieveCityStateSearchParameters(city:string, state:string): Promise<string | undefined> {
      try 
      {
         let region_url = `https://www.zillow.com/homes/${city},-${state}/`;
         // console.log(region_url);
         
         return await axios.get(
            region_url,
            {
               headers: url_headers,
            },
         ).then((res) => {
            const data = res.data;
            const position = data.search(/"queryState"/);
            const bounds = data.substring(
                  position + 14, 
                  data.lastIndexOf("6}]") + 3
            );
            return bounds;
         });
      } catch (err) {
			throw err;
      }
   }

   /**
	 * Get the number of pages that need to be parsed
	 *
	 * @param searchTerm
	 * @param bounds
	 * @returns Number of Pages
	 */
   private async retrieveNumberOfPages(searchTerm:string, bounds:string): Promise<number | undefined> {
      try 
      {
         // logger.info(`${searchTerm}\n`);
         const reqId = Math.floor((Math.random() + 1 ) * 5);
         const filter = `"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}}`;
         const url =  `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,${filter},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`;
         
         // logger.info('Searching...');
         // logger.info(`${url}\n`);
         return await axios.get(
            url,
            {
               headers: url_headers,
            },
         ).then((res) => {
            const cat1 = res.data.cat1;
            return cat1.searchList.totalPages >= 2 ? 2 : cat1.searchList.totalPages;;
         });
      } catch (err) {
			throw err;
      }
   }

   /**
	 * Get the number of pages that need to be parsed
	 *
	 * @param searchTerm
	 * @param numOfPages number of pages to read
	 * @param bounds
	 * @returns Number of Pages
	 */
   private async retrieveResults(searchTerm:string, numOfPages: number,bounds: string): Promise<object[] | undefined> {
      try {
         let results = []
         for (let idx = 1; idx <= numOfPages; idx++) {
            const reqId = Math.floor((Math.random() + 1 ) * 5);
            const url =  `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${idx}},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`
            await axios.get(
               url,
               {
                  headers: url_headers,
               },
            ).then( (res) => {
               const cat1 = res.data.cat1;
               if (cat1)
               {
                  // console.log(url);
                  
                  cat1.searchResults.listResults.map(element => {
                     results.push({
                        priceStr: element.price,
                        priceNum: element.unformattedPrice,
                        address: element.address,
                        street: element.addressStreet,
                        city: element.addressCity,
                        state: element.addressState,
                        zipCode: element.addressZipcode,
                        beds: element.beds,
                        baths: element.baths,
                        area: element.area,
                        url: element.detailUrl,
                        status: element.statusType,
                     })
                  });
               }
               else 
               {
                  UtilityService.handleError('cat1 does not exist!')
               }
            });  
            await UtilityService.sleep(time);     
         }
         return results;
      }
      catch (err) {
         throw err
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
