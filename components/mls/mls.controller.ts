import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import logger from '../../utils/logger';
import UtilityService from '../../utils/utilities';
import AppError from '../../utils/appError';
import { createTablePdf } from '../../utils/pdf.maker';
import path from 'path';
import catchAsync from '../../utils/catchAsync';
import SearchHistory from '../history/history.schema';
import { User } from '../user/user.schema';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Interfaces
interface SearchResult {
  zipCode: string;
  city: string;
  state: string;
  [key: string]: any;
}

interface SearchResponse {
  zipCode?: string;
  cityState?: string;
  listings?: SearchResult[];
  twoBedsQuartile?: any;
  threeBedsQuartile?: any;
  status: 'success' | 'unsuccess';
  results?: any[];
}

interface SearchBody {
  zip_code?: string;
  city?: string;
  state?: string;
}

interface MapBounds {
  [key: string]: any;
}

let MAX_LENGTH = 10;
const SLEEP = 2;

let prevSearchResults: any = null;

let url_headers: { [key: string]: string } = {
  accept: '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'sec-ch-ua-mobile': '?0',
  'user-agent': '',
};

export const searchByZipCode = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  url_headers['user-agent'] = req.get('user-agent') || '';
  
  let user_id = '';
  if (process.env.NODE_ENV === 'development') {
    user_id = '648d20625900ad8cee2c6fca';
  } else {
    const { id } = req.user!;
    user_id = id;
  }
  
  logger.info('Searching by zip code');
  const { zip_code } = req.body as SearchBody;

  const userSettings = UtilityService.getUserSubscription('basic');
  MAX_LENGTH = userSettings.maxAmountResults;

  logger.info(`Zip Code: ${zip_code}`);
  if (!zip_code) {
    return next(new AppError('Not a valid MLS input', 403));
  }

  logger.info('Cleaning up zip code');
  const cleanZipCode = parseInt(zip_code).toString();

  logger.info('Gathering bounds');
  const map_bounds = await retrieveZipCodeSearchParameters(cleanZipCode);

  const searchTerm = `"${cleanZipCode}"`;

  logger.info('Gathering number of pages to search');
  const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);
  if (numOfPages == 0) {
    return next(new AppError('Can not retrieve results', 401));
  }

  logger.info('Gathering results from pages');
  let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

  if (results.length !== 0) {
    logger.info('Grabbing comparable data from zillow');
    const { twoBeds, threeBeds } = await assignPercentiles(results);
    const { trucResults, s_id } = await truncateResultList(searchTerm, results);

    logger.info('Saving users search history');
    User.findById(user_id).then((user) => {
      user!.searchHistory.push(s_id);
      user!.save();
    });

    logger.info('Successfully gathered results');

    const { zipCode, city, state } = trucResults[0];
    const cityState = `${city}, ${state}`;

    prevSearchResults = {
      'search-term': zip_code,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
    };

    const response: SearchResponse = {
      zipCode: zipCode,
      cityState: cityState,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
      status: 'success',
    };

    res.json(response);
  } else {
    logger.info(`No results at this zip code ${zip_code}`);
    res.json({ results: [], status: 'unsuccess' } as SearchResponse);
  }
});

export const searchByCityState = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    url_headers['user-agent'] = req.get('user-agent') || '';
    logger.info('Searching by city and state');
    
    let user_id = '';
    if (process.env.NODE_ENV === 'development') {
      user_id = '648d20625900ad8cee2c6fca';
    } else {
      const { id } = req.user!;
      user_id = id;
    }
    
    const { city, state } = req.body as SearchBody;

    logger.info(`City:${city}, State: ${state}`);
    if (!city && !state) {
      return next(new AppError('Not a valid MLS input', 403));
    }

    logger.info('Gathering bounds');
    const map_bounds = await retrieveCityStateSearchParameters(city!, state!);

    const searchTerm = `"${city}, ${state}"`.toLowerCase();

    logger.info('Gathering number of pages to search');
    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);
    if (numOfPages == 0) {
      return next(new AppError('Can not retrieve results', 401));
    }

    logger.info('Gathering results from pages');
    let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

    if (results.length !== 0) {
      logger.info('Grabbing comparable data from zillow');
      const { twoBeds, threeBeds } = await assignPercentiles(results);
      const { trucResults, s_id } = await truncateResultList(searchTerm, results);

      logger.info('Saving users search history');
      User.findById(user_id).then((user) => {
        user!.searchHistory.push(s_id);
        user!.save();
      });
      
      logger.info('Successfully gathered results');

      const { zipCode, city, state } = trucResults[0];
      const cityState = `${city}, ${state}`;
      
      prevSearchResults = {
        'search-term': `${city}, ${state}`,
        listings: trucResults,
        twoBedsQuartile: twoBeds,
        threeBedsQuartile: threeBeds,
      };
      
      const response: SearchResponse = {
        zipCode: zipCode,
        cityState: cityState,
        listings: trucResults,
        twoBedsQuartile: twoBeds,
        threeBedsQuartile: threeBeds,
        status: 'success',
      };
      
      res.json(response);
    } else {
      logger.info(`No results at this city, state ${city}, ${state}`);
      res.json({ results: [], status: 'unsuccess' } as SearchResponse);
    }
  } catch (err) {
    logger.error(err);
    return next(new AppError('Failed to get results', 502));
  }
  next();
});

export const getSearches = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let results: any[] = [];
  let searchTerm = '';
  
  if (process.env.NODE_ENV === 'development') {
    const id = '648d20625900ad8cee2c6fca';
    // Implementation for development mode
  } else {
    // Implementation for production mode
  }
  
  res.json({
    status: 'success',
    searchTerm: searchTerm,
    results: results,
  });
});

export const downloadPreviousSearch = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!prevSearchResults) {
    return next(new AppError('No previous search results available', 404));
  }

  const pdfBuffer = await createTablePdf(prevSearchResults);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=search_results.pdf');
  res.send(pdfBuffer);
});

export const downloadSample = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sampleData = {
    'search-term': 'Sample Search',
    listings: [],
    twoBedsQuartile: {},
    threeBedsQuartile: {},
  };

  const pdfBuffer = await createTablePdf(sampleData);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=sample_results.pdf');
  res.send(pdfBuffer);
});

// Helper functions
async function truncateResultList(searchTerm: string, results: any[]): Promise<{ trucResults: any[]; s_id: string }> {
  // Implementation
  return { trucResults: results.slice(0, MAX_LENGTH), s_id: 'sample_id' };
}

async function retrieveNumberOfPages(searchTerm: string, bounds: MapBounds): Promise<number> {
  // Implementation
  return 1;
}

async function retrieveCityStateSearchParameters(city: string, state: string): Promise<MapBounds> {
  // Implementation
  return {};
}

async function retrieveZipCodeSearchParameters(zip_code: string): Promise<MapBounds> {
  // Implementation
  return {};
}

async function retrieveResults(searchTerm: string, numOfPages: number, bounds: MapBounds): Promise<any[]> {
  // Implementation
  return [];
}

async function assignPercentiles(listings: any[]): Promise<{ twoBeds: any; threeBeds: any }> {
  // Implementation
  return { twoBeds: {}, threeBeds: {} };
}

async function getComparableHomes(address: string): Promise<any> {
  // Implementation
  return {};
} 