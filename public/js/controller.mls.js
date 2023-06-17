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

function checkAvailability(availability) {
  return availability === "FOR_SALE";
}

export const searchForMLS = async (mls_string) => {
  let url, data;
  // console.log(mls_string);
  if (containsZipCode(mls_string)) {
    const zip_code = getZipCode(mls_string);
    // console.log(zip_code, port);
    url = `http://localhost:${port}/api/v1/mls/searchZip`;
    data = {
      zip_code,
    };
  } else if (containsCityAndState(mls_string)) {
    const { city, state } = getCityAndState(mls_string);
    // console.log(city, state);
    url = `http://localhost:${port}/api/v1/mls/searchCS`;
    data = {
      city,
      state,
    };
  } else {
    console.log("Failed Parsing");
    // showAlert("fail", "Missing");
    return;
  }

  try {
    // console.log(url);
    const token = localStorage.getItem("token");
    // display loading overlay when making API call
    const res = await axios({
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: url,
      data: data,
    });
    const {
      zipCode,
      cityState,
      listings,
      twoBedsQuartile,
      threeBedsQuartile,
      status,
    } = res.data;
    if (status === "success") {
      // console.log(
      //   zipCode,
      //   cityState,
      //   listings,
      //   twoBedsQuartile,
      //   threeBedsQuartile
      // );
      const searchInfoSpan = document.querySelector(
        "#search-results .search-info span"
      );
      searchInfoSpan.textContent = `${cityState} ${zipCode}`;

      // Clear table
      const table = document.getElementById("property-table");
      const tbody = table.tBodies[0];
      for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
      }

      // Update quartile tables
      // Two Bedrooms
      const twoBedTable = document.getElementById("two-bed-table");
      // Find the table cell by ID
      const q1TwoCell = twoBedTable.querySelector("#q1-value span");
      const q2TwoCell = twoBedTable.querySelector("#q2-value span");
      const q3TwoCell = twoBedTable.querySelector("#q3-value span");

      // Make sure there exist comparable for 2 beds
      if (Object.keys(twoBedsQuartile).length !== 0) {
        q1TwoCell.textContent = toUSCurrency(
          twoBedsQuartile.percentile25th || 0
        );
        q2TwoCell.textContent = toUSCurrency(
          twoBedsQuartile.percentile50th || 0
        );
        q3TwoCell.textContent = toUSCurrency(
          twoBedsQuartile.percentile75th || 0
        );
      } else {
        q1TwoCell.textContent = toUSCurrency(0);
        q2TwoCell.textContent = toUSCurrency(0);
        q3TwoCell.textContent = toUSCurrency(0);
      }

      if (q1TwoCell.textContent === "$0.00") {
        if (q1TwoCell.classList.contains("text-emerald-500")) {
          q1TwoCell.classList.remove("text-emerald-500");
          q1TwoCell.classList.add("text-red-500");
        }
      } else {
        if (q1TwoCell.classList.contains("text-red-500")) {
          q1TwoCell.classList.remove("text-red-500");
          q1TwoCell.classList.add("text-emerald-500");
        }
      }
      if (q2TwoCell.textContent === "$0.00") {
        if (q2TwoCell.classList.contains("text-emerald-500")) {
          q2TwoCell.classList.remove("text-emerald-500");
          q2TwoCell.classList.add("text-red-500");
        }
      } else {
        if (q2TwoCell.classList.contains("text-red-500")) {
          q2TwoCell.classList.remove("text-red-500");
          q2TwoCell.classList.add("text-emerald-500");
        }
      }
      if (q3TwoCell.textContent === "$0.00") {
        if (q3TwoCell.classList.contains("text-emerald-500")) {
          q3TwoCell.classList.remove("text-emerald-500");
          q3TwoCell.classList.add("text-red-500");
        }
      } else {
        if (q3TwoCell.classList.contains("text-red-500")) {
          q3TwoCell.classList.remove("text-red-500");
          q3TwoCell.classList.add("text-emerald-500");
        }
      }

      // Three Bedrooms
      const threeBedTable = document.getElementById("three-bed-table");
      // Find the table cell by ID
      const q1ThreeCell = threeBedTable.querySelector("#q1-value span");
      const q2ThreeCell = threeBedTable.querySelector("#q2-value span");
      const q3ThreeCell = threeBedTable.querySelector("#q3-value span");

      // Make sure there exist comparable for 3+ beds
      if (Object.keys(threeBedsQuartile).length !== 0) {
        q1ThreeCell.textContent = toUSCurrency(
          threeBedsQuartile.percentile25th || 0
        );
        q2ThreeCell.textContent = toUSCurrency(
          threeBedsQuartile.percentile50th || 0
        );
        q3ThreeCell.textContent = toUSCurrency(
          threeBedsQuartile.percentile75th || 0
        );
      } else {
        q1ThreeCell.textContent = toUSCurrency(0);
        q2ThreeCell.textContent = toUSCurrency(0);
        q3ThreeCell.textContent = toUSCurrency(0);
      }

      if (q1ThreeCell.textContent === "$0.00") {
        if (q1ThreeCell.classList.contains("text-emerald-500")) {
          q1ThreeCell.classList.remove("text-emerald-500");
          q1ThreeCell.classList.add("text-red-500");
        }
      } else {
        if (q1ThreeCell.classList.contains("text-red-500")) {
          q1ThreeCell.classList.remove("text-red-500");
          q1ThreeCell.classList.add("text-emerald-500");
        }
      }
      if (q2ThreeCell.textContent === "$0.00") {
        if (q2ThreeCell.classList.contains("text-emerald-500")) {
          q2ThreeCell.classList.remove("text-emerald-500");
          q2ThreeCell.classList.add("text-red-500");
        }
      } else {
        if (q2ThreeCell.classList.contains("text-red-500")) {
          q2ThreeCell.classList.remove("text-red-500");
          q2ThreeCell.classList.add("text-emerald-500");
        }
      }
      if (q3ThreeCell.textContent === "$0.00") {
        if (q3ThreeCell.classList.contains("text-emerald-500")) {
          q3ThreeCell.classList.remove("text-emerald-500");
          q3ThreeCell.classList.add("text-red-500");
        }
      } else {
        if (q3ThreeCell.classList.contains("text-red-500")) {
          q3ThreeCell.classList.remove("text-red-500");
          q3ThreeCell.classList.add("text-emerald-500");
        }
      }
      // Add Results to table
      listings.forEach((listing) => {
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
        zpidCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        addressCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        bedCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        bathCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        priceCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        rentToPriceCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        availCell.className =
          "p-2 align-middle bg-transparent border-b whitespace-nowrap";
        addressCell.classList.add("address");

        zpidCell.textContent = listing.zpid;
        // Calculate the rent to price for listing
        if (listing.beds === 2) {
          const rentToPrice = calcRentToPriceRatio(
            listing.price,
            twoBedsQuartile.percentile50th || 0
          );
          rentToPriceCell.textContent = rentToPrice.toFixed(2) + "%";
        } else {
          const rentToPrice = calcRentToPriceRatio(
            listing.price,
            threeBedsQuartile.percentile50th || 0
          );
          rentToPriceCell.textContent = rentToPrice.toFixed(2) + "%";
        }

        // Add zillow link to address cell
        const link = document.createElement("a");
        link.href = listing.url;
        link.textContent = listing.address;
        addressCell.appendChild(link);

        priceCell.textContent = listing.priceStr;
        // availCell.textContent = listing.status;
        bedCell.textContent = listing.beds;
        bathCell.textContent = listing.baths;

        if (checkAvailability(listing.status)) {
          const font = document.createElement("i");
          font.className =
            "bx bx-check text-xl leading-6 relative text-emerald-500";

          // Append the font element to the table cell
          availCell.appendChild(font);
        }
      });

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
          "p-5 mb-4 border border-gray-100 rounded-lg bg-gray-50";
        dateElement.className = "text-lg font-semibold text-gray-900";
        listElement.className = "mt-3 divide-y divider-gray-200";
        listItem.className = "items-center block p-3 sm:flex hover:bg-gray-100";
        listInnerDiv.className = "text-gray-600";
        mainText.className = "text-base font-normal";
        subText.className = "text-sm font-normal";
        timeElement.className =
          "inline-flex items-center text-xs font-normal text-gray-500";
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
