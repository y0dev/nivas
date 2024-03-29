const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("../../utils/logger").logger;
const UtilityService = require("../../utils/utilities");
const AppError = require("../../utils/appError");
const { createTablePdf } = require("../../utils/pdf.maker");
const path = require("path");
const catchAsync = require("../../utils/catchAsync");
const SearchHistory = require("../history/history.schema");
const { User } = require("../user/user.schema");
// const {
//   getResultFromRedisClient,
//   setResultInRedisClient,
// } = require("../../utils/redisServer");

let MAX_LENGTH = 10;
const SLEEP = 2;

let prevSearchResults = null;

let url_headers = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  // 'sec-ch-ua': '\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"',
  "sec-ch-ua-mobile": "?0",
  // 'sec-ch-ua-platform': '\"macOS\"',
  "user-agent": "",
};

exports.searchByZipCode = catchAsync(async (req, res, next) => {
  // url_headers = req.headers;
  url_headers["user-agent"] = req.get("user-agent");
  // For Screen size
  // logger.warn(url_headers["user-agent"]);
  let user_id = "";
  if (process.env.NODE_ENV === "development") {
    user_id = "648d20625900ad8cee2c6fca";
  } else {
    const { id } = req.user;
    user_id = id;
  }
  logger.info("Searching by zip code");
  const { zip_code } = req.body;

  const userSettings = UtilityService.getUserSubscription("basic");
  MAX_LENGTH = userSettings.maxAmountResults;
  // const id = "648d20625900ad8cee2c6fca";

  logger.info(`Zip Code: ${zip_code}`);
  if (!zip_code) {
    return next(new AppError("Not a valid MLS input"), 403);
  }

  logger.info("Cleaning up zip code");
  const cleanZipCode = parseInt(zip_code).toString();

  logger.info("Gathering bounds");
  const map_bounds = await retrieveZipCodeSearchParameters(cleanZipCode);

  const searchTerm = `"${cleanZipCode}"`;

  logger.info("Gathering number of pages to search");
  const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);
  if (numOfPages == 0) {
    return next(new AppError("Can not retrieve results"), 401);
  }

  logger.info("Gathering results from pages");
  let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

  if (results.length !== 0) {
    logger.info("Grabbing comparable data from zillow");
    const { twoBeds, threeBeds } = await assignPercentiles(results);
    const { trucResults, s_id } = await truncateResultList(searchTerm, results);

    logger.info("Saving users search history");
    User.findById(user_id).then((user) => {
      user.searchHistory.push(s_id);
      user.save();
    });

    // addSearchTermToDatabase(id, zip_code, ids, twoBeds, threeBeds);
    logger.info("Successfully gathered results");

    const { zipCode, city, state } = trucResults[0];
    const cityState = `${city}, ${state}`;

    prevSearchResults = {
      "search-term": zip_code,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
    };

    res.json({
      zipCode: zipCode,
      cityState: cityState,
      listings: trucResults,
      twoBedsQuartile: twoBeds,
      threeBedsQuartile: threeBeds,
      status: "success",
    });
  } else {
    logger.info(`No results at this zip code ${zip_code}`);
    res.json({ results: [], status: "unsuccess" });
  }
});

exports.searchByCityState = catchAsync(async (req, res, next) => {
  // req.params.id = req.user.id;
  try {
    url_headers["user-agent"] = req.get("user-agent");
    logger.info("Searching by city and state");
    let user_id = "";
    if (process.env.NODE_ENV === "development") {
      user_id = "648d20625900ad8cee2c6fca";
    } else {
      const { id } = req.user;
      user_id = id;
    }
    const { city, state } = req.body;

    logger.info(`City:${city}, State: ${state}`);
    if (!city && !state) {
      return next(new AppError("Not a valid MLS input"), 403);
    }

    logger.info("Gathering bounds");
    const map_bounds = await retrieveCityStateSearchParameters(city, state);

    const searchTerm = `"${city}, ${state}"`.toLowerCase();

    logger.info("Gathering number of pages to search");
    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);
    if (numOfPages == 0) {
      return next(new AppError("Can not retrieve results"), 401);
    }

    logger.info("Gathering results from pages");
    let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

    if (results.length !== 0) {
      logger.info("Grabbing comparable data from zillow");
      const { twoBeds, threeBeds } = await assignPercentiles(results);
      // logger.info("Gather the results");
      const { trucResults, s_id } = await truncateResultList(
        searchTerm,
        results
      );

      logger.info("Saving users search history");
      User.findById(user_id).then((user) => {
        user.searchHistory.push(s_id);
        user.save();
      });
      logger.info("Successfully gathered results");

      const { zipCode, city, state } = trucResults[0];
      const cityState = `${city}, ${state}`;
      // TODO: Grab latest from db instead
      prevSearchResults = {
        "search-term": `${city}, ${state}`,
        listings: trucResults,
        twoBedsQuartile: twoBeds,
        threeBedsQuartile: threeBeds,
      };
      res.json({
        zipCode: zipCode,
        cityState: cityState,
        listings: trucResults,
        twoBedsQuartile: twoBeds,
        threeBedsQuartile: threeBeds,
        status: "success",
      });
    } else {
      logger.info(`No results at this city, state ${city}, ${state}`);
      res.json({ results: [], status: "unsuccess" });
    }
  } catch (err) {
    logger.error(err);
    return next(new AppError("Failed to get results"), 502);
  }
  next();
});

exports.getSearches = catchAsync(async (req, res, next) => {
  let results = [];
  let searchTerm = "";
  if (process.env.NODE_ENV === "development") {
    const id = "648d20625900ad8cee2c6fca";

    // await getResultFromRedisClient("history", (err, result) => {
    //   res.json({
    //     status: "success",
    //     searchTerm: result.searchTerm.toString(),
    //     results: result.searchItems,
    //   });
    // });

    await User.findById(id)
      .select("searchHistory")
      .then(async (docs) => {
        // Get id in search history
        for (const item of docs.searchHistory) {
          await SearchHistory.findById(item.toString()).then((searchHist) => {
            results.push({
              count: searchHist.searchResults.length,
              date: searchHist.date,
              term: searchHist.searchTerm.toString().replace(/"/g, ""),
            });
          });
        }
      });
  } else {
    const { id, searchHistory } = req.user;
  }
  results.sort((a, b) => b.date.getTime() - a.date.getTime());
  // await setResultInRedisClient(
  //   "history",
  //   {
  //     searchTerm: searchTerm.toString(),
  //     searchItems: results,
  //   },
  //   (err, result) => {
  //     console.log(result.status);
  //   }
  // );
  res.json({
    status: "success",
    searchTerm: searchTerm.toString(),
    results: results,
  });

  // if (searchTerms.length !== 0) {
  //   const options = { month: "long", day: "numeric", year: "numeric" };
  //   // Sort array in descending order so that the latest would be at the top
  //   searchTerms.sort(
  //     (a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()
  //   );

  //   // Create a list of json object that contain search term list with date and time
  //   for (let index = 0; index < searchTerms.length; index++) {
  //     // Get search term from list
  //     const element = searchTerms[index];
  //     // Gather ids
  //     const jsonObject = {
  //       date: element.dateCreated.toLocaleDateString("en-US", options),
  //       time: element.dateCreated.toLocaleTimeString(),
  //       numOfResults: element.searchIds.length,
  //     };
  //     results.push(jsonObject);
  //   }
  // Response with results
  //   res.json({ status: "success", results: results });
  // } else {
  //   res.json({ status: "unsuccess", results: [] });
  // }

  next();
});

exports.downloadSample = catchAsync(async (req, res, next) => {
  // console.log(prevSearchResults);
  // Set the response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
  console.log("here");
  const pdfFilePath = path.join(__dirname, "..", "../pdf/sample.pdf");

  const readStream = fs.createReadStream(pdfFilePath);
  readStream.pipe(res);
  next();
});

exports.downloadPreviousSearch = catchAsync(async (req, res, next) => {
  if (!prevSearchResults) {
    return next(new AppError("Failed to get results"), 502);
  }

  // console.log(prevSearchResults);
  // Set the response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");

  const pdfFilePath = "document.pdf";

  const newFilePath = createTablePdf(pdfFilePath, prevSearchResults);
  res.contentType("application/pdf");
  res.send(results);
  // Create a read stream from the PDF file and pipe it to the response
  const pdfStream = fs.createReadStream(newFilePath);
  pdfStream.pipe(res);
  next();
});

async function truncateResultList(searchTerm, results) {
  let trucResults = [];
  const finalResult = [];
  logger.info("Truncating Results");
  // Check if the list is longer than the maximum length
  if (results.length > MAX_LENGTH) {
    trucResults = results.slice(0, MAX_LENGTH); // Truncate the list to the maximum length
  } else {
    trucResults = results;
  }

  logger.info("Storing results to database");
  // Process each object in the list
  for (let i = 0; i < trucResults.length; i++) {
    let obj = trucResults[i];
    finalResult.push({
      mlsId: obj.zpid,
      price: obj.priceStr,
      address: obj.address,
      city: obj.city,
      state: obj.state,
      beds: obj.beds,
      baths: obj.baths,
    });
  }

  logger.info("Storing search term to database");
  const newSearch = await SearchHistory.create({
    searchTerm: searchTerm,
    searchResults: finalResult,
  });
  logger.info("Saving Search History");
  // console.log(newSearch._id);
  return { trucResults, s_id: newSearch._id };
}

async function retrieveNumberOfPages(searchTerm, bounds) {
  try {
    // logger.info(`${searchTerm}\n`);
    const reqId = Math.floor((Math.random() + 1) * 5);
    const filter = `"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}}`;
    const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,${filter},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`;

    logger.info("Searching...");
    // logger.info(`${url}\n`);
    return await axios
      .get(url, {
        headers: url_headers,
      })
      .then((res) => {
        const cat1 = res.data.cat1;
        if (!cat1) return 0;
        return cat1.searchList.totalPages >= 2 ? 2 : cat1.searchList.totalPages;
      });
  } catch (err) {
    throw err;
  }
}

async function retrieveCityStateSearchParameters(city, state) {
  try {
    let region_url = `https://www.zillow.com/homes/${city},-${state}/`;
    logger.info(region_url);

    return await axios
      .get(region_url, {
        headers: url_headers,
      })
      .then((res) => {
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

async function retrieveZipCodeSearchParameters(zip_code) {
  try {
    const region_url = `https://www.zillow.com/homes/${zip_code}/`;
    logger.info(region_url);
    return await axios
      .get(region_url, {
        headers: url_headers,
      })
      .then((res) => {
        const data = res.data;
        const position = data.search(/"queryState"/);
        const bounds = data.substring(
          position + 14,
          data.lastIndexOf("7}]") + 3
        );

        return bounds;
      });
  } catch (err) {
    throw err;
  }
}

async function retrieveResults(searchTerm, numOfPages, bounds) {
  try {
    let results = [];
    for (let idx = 1; idx <= numOfPages; idx++) {
      const reqId = Math.floor((Math.random() + 1) * 5);
      const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${idx}},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`;
      await axios
        .get(url, {
          headers: url_headers,
        })
        .then((res) => {
          const cat1 = res.data.cat1;
          if (cat1) {
            cat1.searchResults.listResults.map((element) => {
              if (
                element.beds &&
                element.baths &&
                element.area &&
                element.statusType === "FOR_SALE"
              ) {
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
        });
      await UtilityService.sleep(SLEEP);
    }
    return results;
  } catch (err) {
    throw err;
  }
}

async function assignPercentiles(listings) {
  try {
    // Get Quartile prices for 2 bedrooms and 3+ bedrooms
    let results = {
      twoBeds: {},
      threeBeds: {},
    };
    logger.info("Assigning Percentiles to homes");
    const two_beds = listings.find(
      (listing) => listing.beds === 2 && /\d/.test(listing.address)
    );
    const three_beds = listings.find(
      (listing) =>
        listing.beds >= 3 && listing.beds <= 4 && /\d/.test(listing.address)
    );

    logger.info("Grabbing comparable homes");
    if (two_beds) {
      const first_result_address = UtilityService.hyphenateAddress(
        two_beds.address
      );
      results.twoBeds = await getComparableHomes(first_result_address);
    }

    if (three_beds) {
      const second_result_address = UtilityService.hyphenateAddress(
        three_beds.address
      );
      results.threeBeds = await getComparableHomes(second_result_address);
    }

    return results;
  } catch (err) {
    UtilityService.handleError(err);
  }
}

/**
 * Get user invitation
 *
 * @param address
 * @returns User invitation
 */
async function getComparableHomes(address) {
  try {
    let prices = [];
    let comparable = {
      minPrice: 0,
      maxPrice: 0,
      averagePrice: 0,
      percentile25th: 0,
      percentile50th: 0,
      percentile75th: 0,
    };

    logger.info(address);

    // const url = 'https://www.zillow.com/rental-manager/price-my-rental/results/6235-beachcomber-dr-long-beach-ca-90803/';
    const url = `https://www.zillow.com/rental-manager/price-my-rental/results/${address}`;
    await axios
      .get(url, {
        headers: url_headers,
      })
      .then((response) => {
        const $ = cheerio.load(response.data);
        const script = $("script[type*=text/javascript]");
        const text = script.text();
        const list = ['"comparables":', '"filter":'];
        const begin = text.indexOf(list[0]);
        const end = text.indexOf(list[1]);
        const newStr = text
          .substring(begin + list[0].length, end - 1)
          .replace("undefined", '""')
          .trim();
        const json = JSON.parse(newStr); // '(Undisclosed address)'
        // console.log(json);
        // console.log(json['items'][2]);
        // console.log(json["min"]);
        // console.log(json["max"]);
        json["items"].map((element) => {
          if (
            element.street !== "(Undisclosed address)" &&
            element.monthlyRent
          ) {
            prices.push(UtilityService.currencyConverter(element.monthlyRent));
          }
        });

        const percentiles = UtilityService.calcPercentiles(prices);
        comparable.minPrice = parseInt(json["min"]) || 0;
        comparable.maxPrice = parseInt(json["max"]) || 0;
        comparable.averagePrice =
          (comparable.minPrice + comparable.maxPrice) / 2;
        // console.log(prices);
        comparable.percentile25th = percentiles["25th_Percentile"];
        comparable.percentile50th = percentiles["50th_Percentile"];
        comparable.percentile75th = percentiles["75th_Percentile"];
      });

    return comparable;
  } catch (err) {
    throw err;
  }
}
