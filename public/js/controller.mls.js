import "@babel/polyfill";
import axios from "axios";
import { showAlert, showSpinner, hideSpinner, updateMap } from "./utilities";

const port = process.env.PORT || 3000;

/**
 * Check if a string contains a zip code
 * @param {string} str - The input string
 * @returns {boolean} - True if the string contains a zip code, false otherwise
 */
function containsZipCode(str) {
  const zipCodeRegex = /\b\d{5}(?:-\d{4})?\b/;
  return zipCodeRegex.test(str);
}

/**
 * Extract the zip code from a string
 * @param {string} str - The input string
 * @returns {string|null} - The extracted zip code or null if not found
 */
function getZipCode(str) {
  const zipCodeRegex = /\b\d{5}(?:-\d{4})?\b/;
  const match = str.match(zipCodeRegex);
  return match ? match[0] : null;
}

/**
 * Check if a string contains a city and state
 * @param {string} str - The input string
 * @returns {boolean} - True if the string contains a city and state, false otherwise
 */
function containsCityAndState(str) {
  const cityStateRegex = /\b[\w\s]+,\s[A-Z]{2}\b/;
  return cityStateRegex.test(str);
}

/**
 * Extract the city and state from a string
 * @param {string} str - The input string
 * @returns {Object|null} - An object with city and state properties or null if not found
 */
function getCityAndState(str) {
  const cityStateRegex = /\b[\w\s]+,\s[A-Z]{2}\b/;
  const match = str.match(cityStateRegex);
  if (match) {
    const [city, state] = match[0].split(", ");
    return { city, state };
  } else {
    return null;
  }
}

/**
 * Calculate the rent to price ratio
 * @param {number} purchasePrice - The purchase price of the property
 * @param {number} monthlyRent - The monthly rent
 * @returns {number} - The rent to price ratio
 */
function calcRentToPriceRatio(purchasePrice, monthlyRent) {
  return (monthlyRent / purchasePrice) * 100;
}

/**
 * Convert a number to US currency format
 * @param {number} number - The input number
 * @returns {string} - The number formatted as US currency
 */
function toUSCurrency(number) {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Check if a property is available for sale
 * @param {string} availability - The availability status of the property
 * @returns {boolean} - True if the property is for sale, false otherwise
 */
function checkAvailability(availability) {
  return availability === "FOR_SALE";
}

/**
 * Search for MLS listings based on the input string
 * @param {string} mls_string - The input string containing search criteria
 */
export const searchForMLS = async (mls_string) => {
  let url, data;
  if (containsZipCode(mls_string)) {
    const zip_code = getZipCode(mls_string);
    url = `http://localhost:${port}/api/v1/mls/searchZip`;
    data = { zip_code };
  } else if (containsCityAndState(mls_string)) {
    const { city, state } = getCityAndState(mls_string);
    url = `http://localhost:${port}/api/v1/mls/searchCS`;
    data = { city, state };
  } else {
    console.log("Failed Parsing");
    showAlert("fail", "Missing");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await axios({
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      url: url,
      data: data,
    });

    const {
      zipCode,
      cityState,
      listings,
      coord,
      twoBedsQuartile,
      threeBedsQuartile,
      status,
    } = res.data;
    console.log(coord)
    if (status === "success") {
      updateSearchResults(
        zipCode,
        cityState,
        listings,
        coord,
        twoBedsQuartile,
        threeBedsQuartile
      );
    }
  } catch (err) {
    showAlert("fail", err);
  }
};

/**
 * Update the search results on the UI
 * @param {string} zipCode - The zip code of the search
 * @param {string} cityState - The city and state of the search
 * @param {Array} listings - The list of property listings
 * @param {Object} twoBedsQuartile - Quartile data for two-bedroom properties
 * @param {Object} threeBedsQuartile - Quartile data for three-bedroom properties
 */
function updateSearchResults(zipCode, cityState, listings, coordinates, twoBedsQuartile, threeBedsQuartile) {
  const searchInfoSpan = document.querySelector(
    "#search-results .search-info span"
  );
  searchInfoSpan.textContent = `${cityState} ${zipCode}`;

  // Clear existing table rows
  const table = document.getElementById("property-table");
  const tbody = table.tBodies[0];
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  // Update quartile tables for two and three bedrooms
  updateQuartileTable("two-bed-table", twoBedsQuartile);
  updateQuartileTable("three-bed-table", threeBedsQuartile);

  // Add listings to the table
  listings.forEach((listing) => addListingToTable(tbody, listing, twoBedsQuartile, threeBedsQuartile));

  updateMap({ lat: coordinates.latitude, lng: coordinates.longitude });
}

/**
 * Update the quartile table for a given property type
 * @param {string} tableId - The ID of the table to update
 * @param {Object} quartileData - The quartile data for the property type
 */
function updateQuartileTable(tableId, quartileData) {
  const table = document.getElementById(tableId);
  const q1Cell = table.querySelector("#q1-value span");
  const q2Cell = table.querySelector("#q2-value span");
  const q3Cell = table.querySelector("#q3-value span");

  q1Cell.textContent = toUSCurrency(quartileData.percentile25th || 0);
  q2Cell.textContent = toUSCurrency(quartileData.percentile50th || 0);
  q3Cell.textContent = toUSCurrency(quartileData.percentile75th || 0);

  updateCellColor(q1Cell);
  updateCellColor(q2Cell);
  updateCellColor(q3Cell);
}

/**
 * Update the color of a table cell based on its value
 * @param {HTMLElement} cell - The table cell to update
 */
function updateCellColor(cell) {
  if (cell.textContent === "$0.00") {
    cell.classList.remove("text-emerald-500");
    cell.classList.add("text-red-500");
  } else {
    cell.classList.remove("text-red-500");
    cell.classList.add("text-emerald-500");
  }
}

/**
 * Add a listing to the property table
 * @param {HTMLElement} tbody - The table body element
 * @param {Object} listing - The property listing
 * @param {Object} twoBedsQuartile - Quartile data for two-bedroom properties
 * @param {Object} threeBedsQuartile - Quartile data for three-bedroom properties
 */
function addListingToTable(tbody, listing, twoBedsQuartile, threeBedsQuartile) {
  const row = tbody.insertRow();
  const zpidCell = row.insertCell();
  const addressCell = row.insertCell();
  const bedCell = row.insertCell();
  const bathCell = row.insertCell();
  const priceCell = row.insertCell();
  const rentToPriceCell = row.insertCell();
  const availCell = row.insertCell();

  // Apply CSS styles to columns
  row.className = "text-xs";
  zpidCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";
  addressCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap address";
  bedCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";
  bathCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";
  priceCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";
  rentToPriceCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";
  availCell.className = "p-2 align-middle bg-transparent border-b whitespace-nowrap";

  zpidCell.textContent = listing.zpid;

  const rentToPrice = listing.beds === 2
    ? calcRentToPriceRatio(listing.price, twoBedsQuartile.percentile50th || 0)
    : calcRentToPriceRatio(listing.price, threeBedsQuartile.percentile50th || 0);

  rentToPriceCell.textContent = rentToPrice.toFixed(2) + "%";

  const link = document.createElement("a");
  link.href = listing.url;
  link.textContent = listing.address;
  addressCell.appendChild(link);

  priceCell.textContent = listing.priceStr;
  bedCell.textContent = listing.beds;
  bathCell.textContent = listing.baths;

  if (checkAvailability(listing.status)) {
    const font = document.createElement("i");
    font.className = "bx bx-check text-xl leading-6 relative text-emerald-500";
    availCell.appendChild(font);
  }
}

/**
 * Download the sample PDF of search results
 */
export const downloadResults = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/mls/sample-pdf`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    if (res.status >= 200 && res.status < 300) {
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  } catch (err) {
    showAlert("error", "There was an error downloading the results");
  }
};

/**
 * Get the search history
 */
export const getSearchHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/mls/history`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.status === "success") {
      updateSearchHistory(res.data.results);
    }
  } catch (err) {
    showAlert("error", "There was an error retrieving the search history");
  }
};

/**
 * Update the search history on the UI
 * @param {Array} results - The search history results
 */
function updateSearchHistory(results) {
  const historyList = document.getElementById("history-list");
  while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
  }

  results.forEach(resItem => {
    const listItem = document.createElement("li");
    listItem.className = "relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-t-inherit text-inherit rounded-xl";

    const leftContainer = document.createElement("div");
    leftContainer.className = "flex flex-col";
    const dateTitle = document.createElement("h6");
    dateTitle.className = "mb-1 text-sm font-semibold leading-normal text-slate-800 dark:text-slate-500";
    const numResults = document.createElement("span");
    numResults.className = "text-xs leading-tight";
    leftContainer.appendChild(dateTitle);
    leftContainer.appendChild(numResults);

    const rightContainer = document.createElement("div");
    rightContainer.className = "flex items-center text-sm leading-normal";
    const pdfButton = document.createElement("button");
    pdfButton.className = "inline-block px-0 mb-0 ml-6 font-bold leading-normal text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer ease-in bg-150 text-sm tracking-tight-rem bg-x-25 text-slate-800 dark:text-slate-500 py-2.5 active:opacity-85 hover:-translate-y-px";
    const pdfIcon = document.createElement("i");
    pdfIcon.className = "mr-1 text-lg leading-none bx bxs-file-pdf";
    const pdfText = document.createTextNode(" PDF");
    pdfButton.append(pdfIcon);
    pdfButton.append(pdfText);
    rightContainer.appendChild(pdfButton);

    listItem.appendChild(leftContainer);
    listItem.appendChild(rightContainer);
    historyList.appendChild(listItem);

    const date = new Date(resItem.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    dateTitle.textContent = formattedDate;
    numResults.textContent = `Num of Results: ${resItem.count}`;
  });
}
