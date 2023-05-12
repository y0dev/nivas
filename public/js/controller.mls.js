import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alert";

const port = process.env.PORT || 3000;

function containsZipCode(str) {
  // Match 5 digits with optional 4 digits after a space
  const zipCodeRegex = /\b\d{5}(?:-\d{4})?\b/;
  return zipCodeRegex.test(str);
}

function getZipCode(str) {
  // Match 5 digits with optional 4 digits after a space
  const zipCodeRegex = /\b\d{5}(?:-\d{4})?\b/;
  const match = str.match(zipCodeRegex);
  return match ? match[0] : null;
}

function containsCityAndState(str) {
  // Match a city name followed by a comma and 2-letter state code
  const cityStateRegex = /\b[\w\s]+,\s[A-Z]{2}\b/;
  return cityStateRegex.test(str);
}

function getCityAndState(str) {
  // Match a city name followed by a comma and 2-letter state code
  const cityStateRegex = /\b[\w\s]+,\s[A-Z]{2}\b/;
  const match = str.match(cityStateRegex);
  if (match) {
    const [city, state] = match[0].split(", ");
    return { city, state };
  } else {
    return null;
  }
}

function calcRentToPriceRatio(purchasePrice, monthlyRent) {
  return (monthlyRent / purchasePrice) * 100;
}

function toUSCurrency(number) {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const searchForMLS = async (mls_string) => {
  let url, data;
  // console.log(mls_string);
  const searchTitle = document.querySelector("#search-results .title");
  const searchTerm = searchTitle.querySelector(".term");
  if (containsZipCode(mls_string)) {
    const zip_code = getZipCode(mls_string);
    searchTerm.textContent = zip_code;
    // console.log(zip_code);
    url = `http://localhost:${port}/api/v1/mls/searchZip`;
    data = {
      zip_code,
    };
  } else if (containsCityAndState(mls_string)) {
    const { city, state } = getCityAndState(mls_string);
    searchTerm.textContent = `${city}, ${state}`;
    // console.log(city, state);
    url = `http://localhost:${port}/api/v1/mls/searchCS`;
    data = {
      city,
      state,
    };
  } else {
    // console.log("Failed Parsing");
    // showAlert("fail", "Missing");
    return;
  }

  const overlay = document.querySelector(".spinner-overlay");
  try {
    const token = localStorage.getItem("token");
    // display loading overlay when making API call
    overlay.style.display = "block";
    const res = await axios({
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: url,
      data: data,
    });

    if (res.data.status === "success") {
      // showAlert("success", "MLS finish successfully");
      const results = res.data.results;
      const twoBeds = res.data.twoBedsQuartile;
      const threeBeds = res.data.threeBedsQuartile;
      // console.log(results);

      // Clear table
      const searchResultDiv = document.getElementById("search-results");
      const table = document.getElementById("home-table");
      const tbody = table.tBodies[0];
      for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
      }

      // Update quartile tables
      // Two Bedrooms
      const twoBedTable = document.getElementById("two-bed-table");
      // Find the table cell by ID
      const q1TwoCell = twoBedTable.querySelector("#q1-value");
      const q2TwoCell = twoBedTable.querySelector("#q2-value");
      const q3TwoCell = twoBedTable.querySelector("#q3-value");

      q1TwoCell.textContent = toUSCurrency(twoBeds.percentile25th);
      q2TwoCell.textContent = toUSCurrency(twoBeds.percentile50th);
      q3TwoCell.textContent = toUSCurrency(twoBeds.percentile75th);

      // Three Bedrooms
      const threeBedTable = document.getElementById("three-bed-table");
      // Find the table cell by ID
      const q1ThreeCell = threeBedTable.querySelector("#q1-value");
      const q2ThreeCell = threeBedTable.querySelector("#q2-value");
      const q3ThreeCell = threeBedTable.querySelector("#q3-value");

      q1ThreeCell.textContent = toUSCurrency(threeBeds.percentile25th);
      q2ThreeCell.textContent = toUSCurrency(threeBeds.percentile50th);
      q3ThreeCell.textContent = toUSCurrency(threeBeds.percentile75th);

      // Add Results to table
      results.forEach((item) => {
        const row = tbody.insertRow();
        const zpidCell = row.insertCell();
        const addressCell = row.insertCell();
        const bedCell = row.insertCell();
        const bathCell = row.insertCell();
        const priceCell = row.insertCell();
        const rentToPriceCell = row.insertCell();
        const availCell = row.insertCell();

        // row styling
        row.className = "border-b dark:border-neutral-500";
        zpidCell.className = "whitespace-nowrap px-6 py-4";
        addressCell.className = "whitespace-nowrap px-6 py-4";
        bedCell.className = "whitespace-nowrap px-6 py-4";
        bathCell.className = "whitespace-nowrap px-6 py-4";
        priceCell.className = "whitespace-nowrap px-6 py-4";
        rentToPriceCell.className = "whitespace-nowrap px-6 py-4";
        availCell.className = "whitespace-nowrap px-6 py-4";
        // zpidCell.classList.add("dotted-cell");
        addressCell.classList.add("address");

        zpidCell.textContent = item.zpid;
        if (item.beds === 2) {
          const rentToPrice = calcRentToPriceRatio(
            item.price,
            twoBeds.percentile50th
          );
          rentToPriceCell.textContent = rentToPrice.toFixed(2) + "%";
        } else {
          const rentToPrice = calcRentToPriceRatio(
            item.price,
            threeBeds.percentile50th
          );
          rentToPriceCell.textContent = rentToPrice.toFixed(2) + "%";
        }

        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.address;
        addressCell.appendChild(link);

        priceCell.textContent = item.priceStr;
        availCell.textContent = item.status;
        bedCell.textContent = item.beds;
        bathCell.textContent = item.baths;
      });

      if (searchResultDiv.classList.contains("hidden")) {
        searchResultDiv.classList.remove("hidden");
      }
      // hide loading overlay after updating table
      overlay.style.display = "none";

      //   window.setTimeout(() => {
      //     location.assign("/");
      //   }, 1500);
    }
  } catch (err) {
    // showAlert("fail", err.response.data);
  }
};

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
    showAlert("error", "There was an error logging you out");
  }
};

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
      const results = res.data.results;
      const svgNS = "http://www.w3.org/2000/svg";
      const historyContainer = document.getElementById("history-container");
      let previousDate = results[0]["date"];

      let newItem = document.createElement("div");
      let dateElement = document.createElement("time");
      let listElement = document.createElement("ol");
      historyContainer.appendChild(newItem);
      newItem.appendChild(dateElement);
      newItem.appendChild(listElement);
      dateElement.textContent = previousDate;
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        if (previousDate != element["date"]) {
          previousDate = element["date"];
          newItem = document.createElement("div");
          dateElement = document.createElement("time");
          listElement = document.createElement("ol");

          historyContainer.appendChild(newItem);
          newItem.appendChild(dateElement);
          newItem.appendChild(listElement);
          dateElement.textContent = previousDate;
          console.log(previousDate);
        }

        // Add new list item
        const listItem = document.createElement("li");
        const listInnerDiv = document.createElement("div");
        const mainText = document.createElement("div");
        const subText = document.createElement("div");
        const timeElement = document.createElement("span");
        const svgElement = document.createElementNS(svgNS, "svg");
        const pathElement1 = document.createElementNS(svgNS, "path");
        const pathElement2 = document.createElementNS(svgNS, "path");
        newItem.className =
          "p-5 mb-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700";
        dateElement.className =
          "text-lg font-semibold text-gray-900 dark:text-white";
        listElement.className =
          "mt-3 divide-y divider-gray-200 dark:divide-gray-700";
        listItem.className =
          "items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700";
        listInnerDiv.className = "text-gray-600 dark:text-gray-400";
        mainText.className = "text-base font-normal dark:text-white";
        subText.className = "text-sm font-normal";
        timeElement.className =
          "inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400";
        svgElement.classList.add("w-3", "h-3", "mr-1");

        // Append children
        listElement.appendChild(listItem);
        listItem.appendChild(listInnerDiv);
        listInnerDiv.appendChild(mainText);
        listInnerDiv.appendChild(subText);
        listInnerDiv.appendChild(timeElement);

        timeElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 6 L 11 12.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13 11.585938 L 13 6 L 11 6 z"/></svg> ${element["time"]}`;

        if (index % 2 === 0) {
          mainText.textContent = `There are such and such results ${element["numOfResults"]}`;
        } else {
          mainText.textContent = `There are such and such results ${element["numOfResults"]}`;
        }
        subText.textContent = "Sample";
        // timeElement.textContent = element["time"];
      }
    }
  } catch (err) {
    showAlert("error", "There was an error logging you out");
  }
};
