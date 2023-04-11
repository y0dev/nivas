const axios = require("axios");

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

    const { zip_code, user_id } = req.body;

    const cleanZipCode = parseInt(zip_code).toString();

    const map_bounds = await retrieveZipCodeSearchParameters(cleanZipCode);

    const searchTerm = `"${cleanZipCode}"`;

    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);

    const results = await retrieveResults(searchTerm, numOfPages, map_bounds);
    res.json(results);
  } catch (err) {
    next(err);
  }
  next();
};

exports.searchByCityState = async (req, res, next) => {
  // req.params.id = req.user.id;
  try {
    url_headers["user-agent"] = req.get("user-agent");
    const { city, state, user_id } = req.body;

    const map_bounds = await retrieveCityStateSearchParameters(city, state);

    const searchTerm = `"${city}, ${state}"`.toLowerCase();
    const numOfPages = await retrieveNumberOfPages(searchTerm, map_bounds);

    const results = await retrieveResults(searchTerm, numOfPages, map_bounds);

    res.json(results);
  } catch (err) {
    next(err);
  }
  next();
};

async function retrieveNumberOfPages(searchTerm, bounds) {
  try {
    // logger.info(`${searchTerm}\n`);
    const reqId = Math.floor((Math.random() + 1) * 5);
    const filter = `"filterState":{"price":{"min":100000},"monthlyPayment":{"min":495},"sortSelection":{"value":"days"},"isAllHomes":{"value":true}}`;
    const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{},"usersSearchTerm":${searchTerm},${bounds},"isMapVisible":true,${filter},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=${reqId}`;
    // console.log(url);
    // logger.info('Searching...');
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
    // console.log(region_url);

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
