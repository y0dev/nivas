const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const logger = require("../../utils/logger").logger;
const UtilityService = require("../../utils/utilities");
const AppError = require("../../utils/appError");
const { createTablePdf } = require("../../utils/pdf.maker");
const catchAsync = require("../../utils/catchAsync");
const SearchHistory = require("../history/history.schema");
const { User } = require("../user/user.schema");

const MAX_LENGTH_DEFAULT = 10;
const SLEEP = 2;
let prevSearchResults = null;

let urlHeaders = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-ch-ua-mobile": "?0",
  "user-agent": "PostmanRuntime/7.36.1",
};

// Helper function to get user ID
const getUserId = (req) => {
  return process.env.NODE_ENV === "development"
    ? "648d20625900ad8cee2c6fca"
    : req.user.id;
};

// Helper function to handle search history saving
const saveSearchHistory = async (userId, searchId) => {
  const user = await User.findById(userId);
  user.searchHistory.push(searchId);
  await user.save();
};

// Helper function to send results response
const sendResultsResponse = (res, zipCode, cityState, trucResults, twoBeds, threeBeds) => {
  res.json({
    zipCode,
    cityState,
    listings: trucResults,
    twoBedsQuartile: twoBeds,
    threeBedsQuartile: threeBeds,
    status: "success",
  });
};

// Main function to search by zip code
exports.searchByZipCode = catchAsync(async (req, res, next) => {
  urlHeaders["user-agent"] = req.get("user-agent");
  const userId = getUserId(req);

  logger.info("Searching by zip code");
  
  const { zip_code: zipCode } = req.body;
  if (!zipCode) {
    return next(new AppError("Not a valid MLS input", 403));
  }

  const cleanZipCode = parseInt(zipCode).toString();
  logger.info(`Zip Code: ${cleanZipCode}`);

  const userSettings = UtilityService.getUserSubscription("basic");
  const MAX_LENGTH = userSettings.maxAmountResults;

  try {
    const searchParams = await retrieveZipCodeSearchParameters(cleanZipCode);
    const searchTerm = `"${cleanZipCode}"`;

    console.log(searchParams)
    const numOfPages = await retrieveNumberOfPages(cleanZipCode, searchParams.bounds);
    if (numOfPages === 0) {
      return next(new AppError("Cannot retrieve results", 401));
    }

    logger.debug(`Number of Pages: ${numOfPages}`);
    const results = await retrieveResults(searchTerm, numOfPages, searchParams.bounds);
    if (results.length === 0) {
      logger.debug(`No results at this zip code ${cleanZipCode}`);
      return res.json({ results: [], status: "unsuccess" });
    }

    const { twoBeds, threeBeds } = await assignPercentiles(results, searchParams.coordinates);
    const { trucResults, s_id: searchId } = await truncateResultList(searchTerm, results);

    await saveSearchHistory(userId, searchId);

    const { zipCode: resultZipCode, city, state } = trucResults[0];
    const cityState = `${city}, ${state}`;

    prevSearchResults = {
      "search-term": cleanZipCode,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
    };

    sendResultsResponse(res, resultZipCode, cityState, trucResults, twoBeds, threeBeds);
    logger.info("Successfully gathered results");

  } catch (error) {
    logger.error("Error occurred during search by zip code", error);
    next(new AppError("An error occurred during search", 500));
  }
});

// Main function to search by city and state
exports.searchByCityState = catchAsync(async (req, res, next) => {
  urlHeaders["user-agent"] = req.get("user-agent");
  const userId = getUserId(req);

  logger.info("Searching by city and state");

  const { city, state } = req.body;
  if (!city && !state) {
    return next(new AppError("Not a valid MLS input", 403));
  }

  logger.info(`City:${city}, State: ${state}`);

  try {
    const mapBounds = await retrieveCityStateSearchParameters(city, state);
    const searchTerm = `"${city}, ${state}"`.toLowerCase();

    const numOfPages = await retrieveNumberOfPages(searchTerm, mapBounds);
    if (numOfPages === 0) {
      return next(new AppError("Cannot retrieve results", 401));
    }

    const results = await retrieveResults(searchTerm, numOfPages, mapBounds);
    if (results.length === 0) {
      logger.info(`No results at this city, state ${city}, ${state}`);
      return res.json({ results: [], status: "unsuccess" });
    }

    const { twoBeds, threeBeds } = await assignPercentiles(results);
    const { trucResults, s_id: searchId } = await truncateResultList(searchTerm, results);

    await saveSearchHistory(userId, searchId);

    const { zipCode, city: resultCity, state: resultState } = trucResults[0];
    const cityState = `${resultCity}, ${resultState}`;

    prevSearchResults = {
      "search-term": `${city}, ${state}`,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
    };

    sendResultsResponse(res, zipCode, cityState, trucResults, twoBeds, threeBeds);
    logger.info("Successfully gathered results");

  } catch (error) {
    logger.error("Error occurred during search by city and state", error);
    next(new AppError("Failed to get results", 502));
  }
});

// Function to get search history
exports.getSearches = catchAsync(async (req, res, next) => {
  let results = [];

  if (process.env.NODE_ENV === "development") {
    const id = "648d20625900ad8cee2c6fca";
    const user = await User.findById(id).select("searchHistory");

    for (const item of user.searchHistory) {
      const searchHist = await SearchHistory.findById(item.toString());
      results.push({
        count: searchHist.searchResults.length,
        date: searchHist.date,
        term: searchHist.searchTerm.toString().replace(/"/g, ""),
      });
    }
  } else {
    const { searchHistory } = req.user;
    for (const item of searchHistory) {
      const searchHist = await SearchHistory.findById(item.toString());
      results.push({
        count: searchHist.searchResults.length,
        date: searchHist.date,
        term: searchHist.searchTerm.toString().replace(/"/g, ""),
      });
    }
  }

  results.sort((a, b) => b.date.getTime() - a.date.getTime());

  res.json({
    status: "success",
    results,
  });

  next();
});

// Function to download sample PDF
exports.downloadSample = catchAsync(async (req, res, next) => {
  const pdfFilePath = path.join(__dirname, "..", "../pdf/sample.pdf");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");

  const readStream = fs.createReadStream(pdfFilePath);
  readStream.pipe(res);
  next();
});

// Function to download previous search results PDF
exports.downloadPreviousSearch = catchAsync(async (req, res, next) => {
  if (!prevSearchResults) {
    return next(new AppError("Failed to get results", 502));
  }

  const pdfFilePath = "document.pdf";
  const newFilePath = createTablePdf(pdfFilePath, prevSearchResults);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");

  const pdfStream = fs.createReadStream(newFilePath);
  pdfStream.pipe(res);
  next();
});

// Helper function to truncate result list
async function truncateResultList(searchTerm, results) {
  const trucResults = results.length > MAX_LENGTH_DEFAULT 
    ? results.slice(0, MAX_LENGTH_DEFAULT) 
    : results;

  const finalResult = trucResults.map(obj => ({
    mlsId: obj.zpid,
    price: obj.priceStr,
    address: obj.address,
    city: obj.city,
    state: obj.state,
    beds: obj.beds,
    baths: obj.baths,
  }));

  const newSearch = await SearchHistory.create({
    searchTerm,
    searchResults: finalResult,
  });

  return { trucResults, s_id: newSearch._id };
}

// Helper function to retrieve number of pages
async function retrieveNumberOfPages(searchTerm, mapBounds) {
  const reqId = Math.floor((Math.random() + 1) * 5);
  
  const payload = createPayload(searchTerm, mapBounds, reqId);
  const url = `https://www.zillow.com/async-create-search-page-state`;
  urlHeaders["Content-Type"] = "application/json";
  
  try {
    const response = await axios.put(url, payload, { headers: urlHeaders });
    const cat1 = response.data.cat1;
    return cat1 ? Math.min(cat1.searchList.totalPages, 2) : 0;
  } catch (error) {
    if (error.config && error.config.data) {
      console.error(error.config);
      console.error('Request Payload:', JSON.parse(error.config.data));
    }
    logger.error('Error retrieving number of pages:', error);
    throw error;
  }
}


// Helper function to retrieve city and state search parameters
async function retrieveCityStateSearchParameters(city, state) {
  const regionUrl = `https://www.zillow.com/homes/${city},-${state}/`;
  const response = await axios.get(regionUrl, { headers: urlHeaders });

  const data = response.data;
  const $ = cheerio.load(data);
  const script = $("script[type*=application/json]");
  const coords = getCoordFromScript(script);
  const position = data.search(/"queryState"/);
  const bounds = data.substring(position + 14, data.lastIndexOf("6}]") + 3);
  return { bounds: bounds, coordinates: coords};
}

// Helper function to retrieve zip code search parameters
async function retrieveZipCodeSearchParameters(zipCode) {
  const regionUrl = `https://www.zillow.com/homes/${zipCode}/`;
  const response = await axios.get(regionUrl, { headers: urlHeaders });

  const data = response.data;
  const $ = cheerio.load(data);
  const script = $("script[type*=application/json]");
  const coords = getCoordFromScript(script);
  const position = data.search(/"queryState"/);
  const boundsString = data.substring(position + 14, data.lastIndexOf("7}]") + 3);
  const boundsObject = JSON.parse(`{${boundsString}}`); // Parse the string into JSON object
  return { bounds: boundsObject, coordinates: coords};
}

// Helper function to retrieve results
async function retrieveResults(searchTerm, numOfPages, bounds) {
  const results = [];

  for (let idx = 1; idx <= numOfPages; idx++) {
    const reqId = Math.floor((Math.random() + 1) * 5);
    const payload = createPayload(searchTerm, bounds, reqId);
    const url = `https://www.zillow.com/async-create-search-page-state`;
    urlHeaders["Content-Type"] = "application/json";
  
    try {
      const response = await axios.put(url, payload, { headers: urlHeaders });
      const cat1 = response.data.cat1;
      if (cat1) {
        cat1.searchResults.listResults.forEach(element => {
          if (element.beds && element.baths && element.area && element.statusType === "FOR_SALE") {
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
              sqft: parseInt(element.area),
              url: element.detailUrl,
              status: element.statusType,
              zpid: parseInt(element.zpid),
              percentile25th: 0,
              percentile50th: 0,
              percentile75th: 0,
            });
          }
        });
      } else {
        UtilityService.handleError("cat1 does not exist!");
      }
    } catch (error) {
      if (error.config && error.config.data) {
        console.error(error.config);
        console.error('Request Payload:', JSON.parse(error.config.data));
      }
      logger.error('Error retrieving number of pages:', error);
      throw error;
    } finally {
      // Remove the 'Content-Type' key from urlHeaders
      delete urlHeaders['Content-Type'];
    } 
    await UtilityService.sleep(SLEEP);
  }

  return results;
}

// Helper function to assign percentiles
async function assignPercentiles(listings, coordinates) {
  const results = { twoBeds: {}, threeBeds: {} };
  
  const twoBedsListing = listings.find(listing => listing.beds === 2 && /\d/.test(listing.address));
  const threeBedsListing = listings.find(listing => listing.beds >= 3 && listing.beds <= 4 && /\d/.test(listing.address));

  if (twoBedsListing) {
    const queryParams = {
      address: UtilityService.hyphenateAddress(twoBedsListing.address),
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      modelParams: {
        bedrooms: twoBedsListing.beds,
        bathrooms: twoBedsListing.baths,
        property_type: 'single_family'
      }
    }
    results.twoBeds = await getComparableHomes(twoBedsListing, queryParams);
  }

  if (threeBedsListing) {
    const queryParams = {
      address: UtilityService.hyphenateAddress(threeBedsListing.address),
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      modelParams: {
        bedrooms: threeBedsListing.beds,
        bathrooms: threeBedsListing.baths,
        property_type: 'single_family'
      }
    }
    results.threeBeds = await getComparableHomes(threeBedsListing, queryParams);
  }

  return results;
}

// Helper function to get comparable homes
async function getComparableHomes(listing, queryParams) {

  const prices = [];
  const comparable = {
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    averagePrice: 0,
    percentile25th: 0,
    percentile50th: 0,
    percentile75th: 0,
  };

  const url = `https://awning.com/a/rent-estimator`;

  const url_merge = UtilityService.buildUrl(url, queryParams)
  logger.debug(`Url: ${url_merge}`);

  const response = await axios.get(url_merge, { headers: urlHeaders });
  const $ = cheerio.load(response.data);

  const script = $("script[type*=application/json]");
  const comparables = getComparablesFromScript(script);

  let price = undefined;
  if (comparables[0] && comparables[0].askingRent) {
    price = updateRentalPriceAwning(listing, comparables);
  }
  
  let result = UtilityService.findMinMax(comparables, "askingRent");
  logger.debug(`Result: ${result.min} - ${result.max}`);
  

  comparables.forEach(comp => {
    if (comp.askingRent) {
      prices.push(comp.askingRent);
    }
  });

  const percentiles = UtilityService.calcPercentiles(prices);

  logger.debug(`Percentile: ${percentiles["25th_Percentile"]} - ${percentiles["50th_Percentile"]} - ${percentiles["75th_Percentile"]}`);

  comparable.price = price || 0;
  comparable.minPrice = result.min || 0;
  comparable.maxPrice = result.max || 0;
  comparable.averagePrice = (comparable.minPrice + comparable.maxPrice) / 2;
  comparable.percentile25th = percentiles["25th_Percentile"];
  comparable.percentile50th = percentiles["50th_Percentile"];
  comparable.percentile75th = percentiles["75th_Percentile"];

  return comparable;
}

// Function to create the payload object
function createPayload(searchTerm, mapBounds, reqId) {
  const filterState = {
    price: { min: 100000 },
    monthlyPayment: { min: 495 },
    sortSelection: { value: "globalrelevanceex" },
    isAllHomes: { value: true }
  };

  const searchQueryState = {
    pagination: {},
    usersSearchTerm: searchTerm,
    filterState: filterState,
    isMapVisible: true,
    isListVisible: true,
    mapBounds: mapBounds.mapBounds,
    regionSelection: mapBounds.regionSelection,
    mapZoom: 12
  };

  return {
    searchQueryState: searchQueryState,
    wants: {
      cat1: ["listResults", "mapResults"],
      cat2: ["total"]
    },
    requestId: reqId
  };
}

function getComparablesFromScript(script) {
  // Get the text content of the script
  const text = script.text();

  // Parse the text content to an object
  const json = UtilityService.safeJsonParse(text);

  const rentEstimator = UtilityService.findKeyContainingSubstring(json.props.pageProps["__storeData"], "rentEstimatorStore");
  const data = json.props.pageProps["__storeData"][rentEstimator]

  // Check if the initial state and the comparables object exist
  if (data && data.state) {
    const listingJson = UtilityService.safeJsonParse(data.state);
    return listingJson.listings;
  }

  return null; // Return null if the comparables object is not found
}

function getCoordFromScript(script) {
  // Get the text content of the script
  const text = script.text();
  
  // Parse the text content to an array of objects
  const matches = findLatLong(text);

  // Check if the matches has contents
  if (matches.length > 0) {
    return matches[0];
  }

  return null; // Return null if the matches aren't found
}

/**
 * Finds all occurrences of "latLong":{"latitude":<latitude>,"longitude":<longitude>} in a text
 * and ensures that "latLong" is not null.
 * 
 * @param {string} text - The input text to search within.
 * @returns {Array} - An array of objects containing latitude and longitude.
 */
function findLatLong(text) {
  const latLongPattern = /"latLong":\{"latitude":([\d.-]+),"longitude":([\d.-]+)\}/g;
  const matches = [];
  let match;

  while ((match = latLongPattern.exec(text)) !== null) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      matches.push({ latitude, longitude });
    }
  }

  return matches;
}

// Function to update rental price based on comparable properties
function updateRentalPriceAwning(currentProperty, comparableProperties) {
  // Calculate average rent, size, beds, and baths for comparable properties
  let totalRent = 0;
  let totalSqft = 0;
  let totalBeds = 0;
  let totalBaths = 0;

  comparableProperties.forEach(property => {
      totalRent += property.askingRent;
      totalSqft += property.unitSqFt;
      totalBeds += property.bedroomCount;
      totalBaths += property.bathroomCount;
  });

  let avgRent = totalRent / comparableProperties.length;
  let avgSqft = totalSqft / comparableProperties.length;
  let avgBeds = totalBeds / comparableProperties.length;
  let avgBaths = totalBaths / comparableProperties.length;

  // Adjust rental price based on size, beds, and baths differences
  let sizeDifference = currentProperty.sqft - avgSqft;
  let bedsDifference = currentProperty.beds - avgBeds;
  let bathsDifference = currentProperty.baths - avgBaths;

  let rentAdjustment = sizeDifference * 0.1 + bedsDifference * 100 + bathsDifference * 50;

  // Calculate updated rental price
  let updatedRent = avgRent + rentAdjustment;

  // Return the updated rental price
  return parseInt(updatedRent);
}