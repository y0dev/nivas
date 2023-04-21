const axios = require("axios");
const logger = require("../../utils/logger").logger;
const { MLS, SearchTerm } = require("./mls.schema");

const MAX_LENGTH = 10;

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

    logger.info("Searching by zip code");

    const { zip_code, user_id } = req.body;

    logger.info(`Zip Code: ${zip_code}`);
    if (zip_code) {
      logger.info(`Saving zip code to db`);
      addSearchTermToDatabase("0123456789", zip_code);
    }

    logger.info("Cleaning up zip code");
    const cleanZipCode = parseInt(zip_code).toString();

    logger.info("Gathering bounds");
    const map_bounds = await retrieveZipCodeSearchParameters(cleanZipCode);

    const searchTerm = `"${cleanZipCode}"`;

    logger.info("Gathering number of pages to search");
    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);

    logger.info("Gathering results from pages");
    let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

    if (results.length !== 0) {
      // logger.info("Gather the results");
      results = truncateResultList(results);
      logger.info("Successfully gathered results");
      res.json({ results, status: "success" });
    } else {
      logger.info(`No results at this zip code ${zip_code}`);
      res.json({ results: [], status: "unsuccess" });
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
  next();
};

exports.searchByCityState = async (req, res, next) => {
  // req.params.id = req.user.id;
  try {
    url_headers["user-agent"] = req.get("user-agent");
    logger.info("Searching by city and state");
    const { city, state, user_id } = req.body;

    logger.info(`City:${city}, State: ${state}`);

    logger.info("Gathering bounds");
    const map_bounds = await retrieveCityStateSearchParameters(city, state);

    const searchTerm = `"${city}, ${state}"`.toLowerCase();

    logger.info("Gathering number of pages to search");
    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);

    logger.info("Gathering results from pages");
    let results = await retrieveResults(searchTerm, numOfPages, map_bounds);

    if (results.length !== 0) {
      // logger.info("Gather the results");
      results = truncateResultList(results);
      logger.info("Successfully gathered results");
      res.json({ results, status: "success" });
    } else {
      logger.info(`No results at this city, state ${city}, ${state}`);
      res.json({ results: [], status: "unsuccess" });
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
  next();
};

exports.getSearches = async (req, res, next) => {
  const mls = await SearchTerm.find({ userId: req.body.id });

  logger.info(mls);
};

function truncateResultList(results) {
  logger.info("Truncating Results");
  // Check if the list is longer than the maximum length
  if (results.length > MAX_LENGTH) {
    results = results.slice(0, MAX_LENGTH); // Truncate the list to the maximum length
  }
  logger.info("Storing results to database");
  // Process each object in the list
  for (let i = 0; i < results.length; i++) {
    let obj = results[i];
    // Do something with the object
    addMLSInfoToDatabase("0123456789", obj);
  }
  return results;
}
async function addSearchTermToDatabase(userId, term) {
  await SearchTerm.create({
    userId: userId,
    term: term,
  });
}
async function addMLSInfoToDatabase(userId, homeInfo) {
  await MLS.create({
    userId: userId,
    mlsId: homeInfo.zpid,
    price: homeInfo.priceStr,
    address: homeInfo.address,
    city: homeInfo.city,
    state: homeInfo.state,
    numOfBeds: homeInfo.beds,
    numOfBaths: homeInfo.baths,
  });
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
            // UtilityService.handleError("cat1 does not exist!");
          }
        });
      // await UtilityService.sleep(time);
    }
    return results;
  } catch (err) {
    throw err;
  }
}
