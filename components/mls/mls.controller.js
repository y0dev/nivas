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
    const mapBounds = await retrieveZipCodeSearchParameters(cleanZipCode);
    const searchTerm = `"${cleanZipCode}"`;

    logger.debug(`Searching... ${searchTerm}`);
    const numOfPages = await retrieveNumberOfPages(searchTerm, mapBounds);
    if (numOfPages === 0) {
      return next(new AppError("Cannot retrieve results", 401));
    }

    logger.debug(`Number of Pages: ${numOfPages}`);
    const results = await retrieveResults(searchTerm, numOfPages, mapBounds);
    if (results.length === 0) {
      logger.debug(`No results at this zip code ${cleanZipCode}`);
      return res.json({ results: [], status: "unsuccess" });
    }

    logger.debug(`Search Results: ${results}`);
    const { twoBeds, threeBeds } = await assignPercentiles(results);
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
async function retrieveNumberOfPages(searchTerm, bounds) {
  const reqId = Math.floor((Math.random() + 1) * 5);

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
    mapBounds: bounds,
    mapZoom: 12
  };

  const payload = {
    searchQueryState: searchQueryState,
    wants: {
      cat1: ["listResults", "mapResults"],
      cat2: ["total"]
    },
    requestId: reqId
  };

  const url = `https://www.zillow.com/async-create-search-page-state`;
  logger.debug(`URL: ${url}`);
  console.log("Payload: %j", payload);
  urlHeaders["Content-Type"] = "application/json";
  console.log("Headers: %j", urlHeaders);
  
  try {
    const response = await axios.put(url, payload, { headers: urlHeaders });
    logger.debug(`Response: ${response.data}`);
    const cat1 = response.data.cat1;
    return cat1 ? Math.min(cat1.searchList.totalPages, 2) : 0;
  } catch (error) {
    logger.error('Error retrieving number of pages:', error);
    throw error;
  } finally {
    // Remove the 'Content-Type' key from urlHeaders
    delete urlHeaders['Content-Type'];
}
}


// Helper function to retrieve city and state search parameters
async function retrieveCityStateSearchParameters(city, state) {
  const regionUrl = `https://www.zillow.com/homes/${city},-${state}/`;
  const response = await axios.get(regionUrl, { headers: urlHeaders });

  const data = response.data;
  const position = data.search(/"queryState"/);
  const bounds = data.substring(position + 14, data.lastIndexOf("6}]") + 3);
  return bounds;
}

// Helper function to retrieve zip code search parameters
async function retrieveZipCodeSearchParameters(zipCode) {
  const regionUrl = `https://www.zillow.com/homes/${zipCode}/`;
  const response = await axios.get(regionUrl, { headers: urlHeaders });

  const data = response.data;
  const position = data.search(/"queryState"/);
  const bounds = data.substring(position + 14, data.lastIndexOf("7}]") + 3);
  return bounds;
}

// Helper function to retrieve results
async function retrieveResults(searchTerm, numOfPages, bounds) {
  const results = [];

  for (let idx = 1; idx <= numOfPages; idx++) {
    const reqId = Math.floor((Math.random() + 1) * 5);
    const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${idx}},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`;
    
    const response = await axios.get(url, { headers: urlHeaders });
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

    await UtilityService.sleep(SLEEP);
  }

  return results;
}

// Helper function to assign percentiles
async function assignPercentiles(listings) {
  const results = { twoBeds: {}, threeBeds: {} };

  const twoBedsListing = listings.find(listing => listing.beds === 2 && /\d/.test(listing.address));
  const threeBedsListing = listings.find(listing => listing.beds >= 3 && listing.beds <= 4 && /\d/.test(listing.address));

  if (twoBedsListing) {
    const firstResultAddress = UtilityService.hyphenateAddress(twoBedsListing.address);
    results.twoBeds = await getComparableHomes(firstResultAddress);
  }

  if (threeBedsListing) {
    const secondResultAddress = UtilityService.hyphenateAddress(threeBedsListing.address);
    results.threeBeds = await getComparableHomes(secondResultAddress);
  }

  return results;
}

// Helper function to get comparable homes
async function getComparableHomes(address) {
  const prices = [];
  const comparable = {
    minPrice: 0,
    maxPrice: 0,
    averagePrice: 0,
    percentile25th: 0,
    percentile50th: 0,
    percentile75th: 0,
  };

  const url = `https://www.zillow.com/rental-manager/price-my-rental/results/${address}`;
  const response = await axios.get(url, { headers: urlHeaders });
  const $ = cheerio.load(response.data);

  const script = $("script[type*=text/javascript]");
  const text = script.text();
  const json = JSON.parse(text.match(/"comparables":({.*?})/)[1]);

  json.items.forEach(element => {
    if (element.street !== "(Undisclosed address)" && element.monthlyRent) {
      prices.push(UtilityService.currencyConverter(element.monthlyRent));
    }
  });

  const percentiles = UtilityService.calcPercentiles(prices);
  comparable.minPrice = parseInt(json.min) || 0;
  comparable.maxPrice = parseInt(json.max) || 0;
  comparable.averagePrice = (comparable.minPrice + comparable.maxPrice) / 2;
  comparable.percentile25th = percentiles["25th_Percentile"];
  comparable.percentile50th = percentiles["50th_Percentile"];
  comparable.percentile75th = percentiles["75th_Percentile"];

  return comparable;
}
