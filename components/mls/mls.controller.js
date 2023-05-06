const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("../../utils/logger").logger;
const { MLS, SearchTerm } = require("./mls.schema");
const UtilityService = require("../../utils/utilities");
const AppError = require("../../utils/appError");
const { createTablePdf } = require("../../utils/pdf.maker");
const path = require("path");

const MAX_LENGTH = 10;
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

exports.searchByZipCode = async (req, res, next) => {
  // req.params.id = req.user.id;
  try {
    url_headers["user-agent"] = req.get("user-agent");
    // For Screen size
    // logger.warn(url_headers["user-agent"]);

    logger.info("Searching by zip code");
    const { zip_code } = req.body;
    const { id } = req.user;

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
      logger.info(`Saving zip code to db`);

      logger.info("Grabbing comparable data from zillow");
      await assignPercentiles(results);

      const { trucResults, ids } = await truncateResultList(id, results);
      addSearchTermToDatabase(id, zip_code, ids);
      logger.info("Successfully gathered results");

      prevSearchResults = {
        "search-term": zip_code,
        results: trucResults,
      };
      res.json({ results: trucResults, status: "success" });
    } else {
      logger.info(`No results at this zip code ${zip_code}`);
      res.json({ results: [], status: "unsuccess" });
    }
  } catch (err) {
    logger.error(err);
    return next(new AppError("Failed to get results"), 502);
  }
  next();
};

exports.searchByCityState = async (req, res, next) => {
  // req.params.id = req.user.id;
  try {
    url_headers["user-agent"] = req.get("user-agent");
    logger.info("Searching by city and state");
    const { city, state } = req.body;
    const { id } = req.user;

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
      await assignPercentiles(results);
      // logger.info("Gather the results");
      const { trucResults, ids } = await truncateResultList(id, results);

      logger.info(`Saving zip code to db`);
      addSearchTermToDatabase(id, `${city}, ${state}`, ids);
      logger.info("Successfully gathered results");

      prevSearchResults = {
        "search-term": `${city}, ${state}`,
        results: trucResults,
      };
      res.json({ results: trucResults, status: "success" });
    } else {
      logger.info(`No results at this city, state ${city}, ${state}`);
      res.json({ results: [], status: "unsuccess" });
    }
  } catch (err) {
    logger.error(err);
    return next(new AppError("Failed to get results"), 502);
  }
  next();
};

exports.getSearches = async (req, res, next) => {
  const { id } = req.user;
  const searchTerms = await SearchTerm.find({ userId: id });
  let results = [];
  if (searchTerms.length !== 0) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    // Sort array in descending order so that the latest would be at the top
    searchTerms.sort(
      (a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()
    );

    // Create a list of json object that contain search term list with date and time
    for (let index = 0; index < searchTerms.length; index++) {
      // Get search term from list
      const element = searchTerms[index];
      // Gather ids
      const jsonObject = {
        date: element.dateCreated.toLocaleDateString("en-US", options),
        time: element.dateCreated.toLocaleTimeString(),
        numOfResults: element.searchIds.length,
      };
      results.push(jsonObject);
    }
    // Response with results
    res.json({ status: "success", results: results });
  } else {
    res.json({ status: "unsuccess", results: [] });
  }

  next();
};
exports.downloadSample = async (req, res, next) => {
  // console.log(prevSearchResults);
  // Set the response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
  console.log("here");
  const pdfFilePath = path.join(__dirname, "..", "../pdf/sample.pdf");

  const readStream = fs.createReadStream(pdfFilePath);
  readStream.pipe(res);
  next();
};
exports.downloadPreviousSearch = async (req, res, next) => {
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
};

async function truncateResultList(user_id, results) {
  let ids = [];
  let trucResults = [];
  logger.info("Truncating Results");
  // Check if the list is longer than the maximum length
  if (results.length > MAX_LENGTH) {
    trucResults = results.slice(0, MAX_LENGTH); // Truncate the list to the maximum length
  }
  logger.info("Storing results to database");
  // Process each object in the list
  for (let i = 0; i < trucResults.length; i++) {
    let obj = trucResults[i];
    // Do something with the object
    const id = await addMLSInfoToDatabase(user_id, obj);
    ids.push(id);
  }
  logger.info(ids);
  return { trucResults, ids };
}
async function addSearchTermToDatabase(userId, term, searchIds) {
  await SearchTerm.create({
    userId: userId,
    term: term,
    searchIds: searchIds,
  });
}
async function addMLSInfoToDatabase(userId, homeInfo) {
  const doc = await MLS.create({
    userId: userId,
    mlsId: homeInfo.zpid,
    price: homeInfo.priceStr,
    address: homeInfo.address,
    city: homeInfo.city,
    state: homeInfo.state,
    numOfBeds: homeInfo.beds,
    numOfBaths: homeInfo.baths,
  });
  return doc._id;
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

async function assignPercentiles(results) {
  try {
    logger.info("Assigning Percentiles to homes");
    const two_beds = results.find((element) => element.beds === 2);
    const three_beds = results.find((element) => element.beds === 3);
    const four_or_more_beds = results.find((element) => element.beds >= 4);

    logger.info("Grabbing comparable homes");
    let first_result_address;
    let first_result_comp;
    if (two_beds) {
      first_result_address = UtilityService.hyphenateAddress(two_beds.address);
      first_result_comp = await getComparableHomes(first_result_address);
    }
    let second_result_address;
    let second_result_comp;
    if (three_beds) {
      second_result_address = UtilityService.hyphenateAddress(
        three_beds.address
      );
      second_result_comp = await getComparableHomes(second_result_address);
    }
    let third_result_address;
    let third_result_comp;
    if (four_or_more_beds) {
      third_result_address = UtilityService.hyphenateAddress(
        four_or_more_beds.address
      );
      third_result_comp = await getComparableHomes(third_result_address);
    }

    results.forEach((element) => {
      if (four_or_more_beds && element.beds >= four_or_more_beds.beds) {
        const result = third_result_comp;
        element.percentile25th =
          UtilityService.percentage(result.percentile25th, element.price) || 0;
        element.percentile50th = UtilityService.percentage(
          result.percentile50th,
          element.price
        );
        element.percentile75th = UtilityService.percentage(
          result.percentile75th,
          element.price
        );
      } else if (three_beds && element.beds >= three_beds.beds) {
        const result = second_result_comp;
        element.percentile25th =
          UtilityService.percentage(result.percentile25th, element.price) || 0;
        element.percentile50th = UtilityService.percentage(
          result.percentile50th,
          element.price
        );
        element.percentile75th = UtilityService.percentage(
          result.percentile75th,
          element.price
        );
      } else if (two_beds && element.beds >= two_beds.beds) {
        const result = first_result_comp;
        element.percentile25th =
          UtilityService.percentage(result.percentile25th, element.price) || 0;
        element.percentile50th = UtilityService.percentage(
          result.percentile50th,
          element.price
        );
        element.percentile75th = UtilityService.percentage(
          result.percentile75th,
          element.price
        );
      }
    });
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
      properties: [],
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

        // console.log(json['items'][2]);
        // console.log(json['min']);
        // console.log(json['max']);
        json["items"].map((element) => {
          if (
            element.street !== "(Undisclosed address)" &&
            element.monthlyRent
          ) {
            prices.push(UtilityService.currencyConverter(element.monthlyRent));
            comparable.properties.push({
              zpid: element.zpid,
              monthlyRent: element.monthlyRent,
              bubblePrice: element.bubblePrice,
              sqft: element.sqft,
              pricePerSqft: element.pricePerSqft,
              street: element.street || "",
              city: element.city || "",
              state: element.state || "",
              zipCode: parseInt(element.zip) || 0,
              beds: parseInt(element.beds) || 0,
              baths: parseInt(element.baths) || 0,
              position: {
                latitude: parseFloat(element.lat) || 0,
                longitude: parseFloat(element.lon) || 0,
              },
            });
          }
        });
        comparable.minPrice = parseInt(json["min"]) || 0;
        comparable.maxPrice = parseInt(json["max"]) || 0;
        comparable.averagePrice =
          (comparable.minPrice + comparable.maxPrice) / 2;
        const percentiles = UtilityService.calcPercentiles(prices);

        comparable.percentile25th = percentiles["25th_Percentile"];
        comparable.percentile50th = percentiles["50th_Percentile"];
        comparable.percentile75th = percentiles["75th_Percentile"];
      });

    return comparable;
  } catch (err) {
    throw err;
  }
}
