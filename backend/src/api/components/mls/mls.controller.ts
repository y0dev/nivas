import axios from 'axios';
import { load } from 'cheerio';
import { map } from 'cheerio/lib/api/traversing';
import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../../../config/logger';
import { UtilityService } from '../../../services/utility';
import { MLSModel } from './mls.model';

import { MLSRepository } from './mls.repository';
import { IMLSModel, IMLSDocument, PropertyModel, Comparables, ComparableModel } from './mls.types';


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

const time = 0.5;

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
         const results = await this.retrieveResults(searchTerm,numOfPages,map_bounds);

         logger.info('Grabbing comparable data from zillow');
         const homeStr = 'homedetails/';
         const regex = /\/[0-9]+_zpid/;
         const two_bed = results.find( (element) => element.beds === 2 );
         const three_bed = results.find( (element) => element.beds === 3 );
         const s_idx0 = two_bed.url.indexOf(homeStr);
         const s_idx1 = three_bed.url.indexOf(homeStr);
         const e_idx0 = two_bed.url.search(regex);
         const e_idx1 = two_bed.url.search(regex);
         const two_bed_url = two_bed.url.substring( s_idx0 + homeStr.length, e_idx0 );
         const three_bed_url = three_bed.url.substring( s_idx1 + homeStr.length, e_idx1 );

         const two_bed_comp   = await this.getComparableHomes(two_bed_url);
         const three_bed_comp = await this.getComparableHomes(three_bed_url);
         
         results.forEach(element => {
            if (element.beds === 2) {
               element.percentile25th = UtilityService.percentage(two_bed_comp.percentile25th,element.price) || 0;
               element.percentile50th = UtilityService.percentage(two_bed_comp.percentile50th,element.price);
               element.percentile75th = UtilityService.percentage(two_bed_comp.percentile75th,element.price);
            } else if (element.beds === 3) {
               element.percentile25th = UtilityService.percentage(three_bed_comp.percentile25th,element.price) || 0;
               element.percentile50th = UtilityService.percentage(three_bed_comp.percentile50th,element.price);
               element.percentile75th = UtilityService.percentage(three_bed_comp.percentile75th,element.price);
            }
         });
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
         const now = new Date();
         const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'};
         const date = `${now.toLocaleDateString('en-US', options)} ${now.toLocaleTimeString('en-US',{timeStyle: 'full'})}`
         return res.json({ 'date': date, 'results':results, 'two_bed': two_bed_comp, 'three_bed': three_bed_comp })
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
   private async retrieveResults(searchTerm:string, numOfPages: number,bounds: string): Promise<IMLSModel[] | undefined> {
      try {
         let results: IMLSModel[] = [];
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
                     // console.log(element);
                     
                     results.push({
                        price: element.unformattedPrice,
                        priceStr: element.price,
                        address: element.address,
                        city: element.addressCity,
                        state: element.addressState,
                        zipCode: parseInt(element.addressZipcode),
                        beds: parseInt(element.beds),
                        baths: parseInt(element.baths),
                        street: element.addressStreet,
                        area: parseInt(element.area),
                        url: element.detailUrl,
                        status: element.statusType,
                        zpid: parseInt(element.zpid),
                        percentile25th: 0,
                        percentile50th: 0,
                        percentile75th: 0
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


   /**
	 * Get user invitation
	 *
	 * @param u_id
	 * @param email
	 * @returns User invitation
	 */
	@bind
	private async getComparableHomes(address: string): Promise<Comparables | undefined> {
		try {
         let prices: number[] = [];
         let comparables: Comparables = {
            minPrice: 0,
            maxPrice: 0,
            averagePrice: 0,
            properties: [],
            percentile25th: 0,
            percentile50th: 0,
            percentile75th: 0
         }

         console.log(address);
         
         // const url = 'https://www.zillow.com/rental-manager/price-my-rental/results/6235-beachcomber-dr-long-beach-ca-90803/';
         const url = `https://www.zillow.com/rental-manager/price-my-rental/results/${address}`;
         await axios.get(url,
            {
               headers: url_headers,
               // params: url_params
            })
            .then((response) => {
               const $ = load(response.data);
               const script = $('script[type*=text/javascript]');
               const text = script.text();
               const list = ['"comparables":','"filter":']
               const begin = text.indexOf(list[0]);
               const end = text.indexOf(list[1]);
               const newStr = text.substring(begin+list[0].length,end-1).replace('undefined','""').trim();
               const json = JSON.parse(newStr); // '(Undisclosed address)'

               // console.log(json['items'][2]);
               // console.log(json['min']);
               // console.log(json['max']);
               json['items'].map((element) => {
                  
                  if(element.street !== '(Undisclosed address)' &&
                     element.monthlyRent)
                  {
                     prices.push(UtilityService.currencyConverter(element.monthlyRent));
                     comparables.properties.push({
                        zpid: element.zpid,
                        monthlyRent: element.monthlyRent,
                        bubblePrice: element.bubblePrice,
                        sqft: element.sqft,
                        pricePerSqft: element.pricePerSqft,
                        street: element.street || '',
                        city: element.city || '',
                        state: element.state || '',
                        zipCode: parseInt(element.zip) || 0,
                        beds: parseInt(element.beds) || 0,
                        baths: parseInt(element.baths) || 0,
                        position: {
                           latitude: parseFloat(element.lat) || 0,
                           longitude: parseFloat(element.lon) || 0,
                        }
                     })
                  }
               });
               comparables.minPrice = parseInt(json['min']) || 0;
               comparables.maxPrice = parseInt(json['max']) || 0;
               comparables.averagePrice = ( comparables.minPrice + comparables.maxPrice ) / 2;
               const percentiles = UtilityService.calcPercentiles(prices);

               comparables.percentile25th = percentiles['25th_Percentile'];
               comparables.percentile50th = percentiles['50th_Percentile'];
               comparables.percentile75th = percentiles['75th_Percentile'];
               
               
            });
         // console.log(comparables);
         
			return comparables;
		} catch (err) {
			throw err;
		}
	}

   // /**
	//  * Get user invitation
	//  *
	//  * @param u_id
	//  * @param email
	//  * @returns User invitation
	//  */
	// @bind
   // private async name(zip_code:string): Promise<PropertyModel[] | undefined> {
   //    try {
   //       let results = []
   //       const url = 'https://www.padmapper.com/apartments/lakewood-ca/';
   //       axios.get(url,
   //       {
   //          headers: url_headers
   //       })
   //       .then((response) => {
   //          const $ = cheerio.load(response.data);
   //          const listScroll = $('div[class*=list_listScroll]');
   //          const listContainer = listScroll.find('div[class*=list_listItemContainer]');
   //          const div = listContainer.children().first();
         
   //          div.children().each((idx, ele) => {
               
   //             const price = $(ele).find('div[class*=ListItemFull_price]').text()
   //             const infoBox = $(ele).find('div[class*=ListItemFull_infoBox]').text();
   //             const address = $(ele).find('meta[itemprop*=streetAddress]').attr('content');
   //             const city = $(ele).find('meta[itemprop*=addressLocality]').attr('content');
   //             const state = $(ele).find('meta[itemprop*=addressRegion]').attr('content');
   //             const zipCode = $(ele).find('meta[itemprop*=postalCode]').attr('content');
   //             const latitude = $(ele).find('meta[itemprop*=latitude]').attr('content');
   //             const longitude = $(ele).find('meta[itemprop*=longitude]').attr('content');
               
   //             const bedIndex = infoBox.search(/[0-9] Bed|[0-9] bed/);
   //             const bathIndex = infoBox.search(/[0-9] Bath|[0-9] bath/);
   //             const beds = infoBox.substring(bedIndex, bedIndex + 5);
   //             const baths = infoBox.substring(bathIndex,bathIndex + 6);
   //             const info = {
   //                   price: UtilityService.currencyConverter(price),
   //                   priceStr: price,
   //                   address,
   //                   beds: parseInt(beds),
   //                   baths: parseInt(baths),
   //                   city,
   //                   state,
   //                   zipCode: parseInt(zipCode),
   //                   position: {
   //                      latitude: parseInt(latitude),
   //                      longitude: parseInt(longitude)
   //                   }
   //             };
   //             results.push(info);
   //          });
   //          return results;
   //       }
   //    } catch (err) {
   //       throw err;
   //    }
   // }
}
