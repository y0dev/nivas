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
      // console.log(results);

      // Remove temp history
      const historyList = document.getElementById("history-list");
      while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
      }

      for (const resItem of results) {
        // console.log(resItem);
        // List Styling
        const listItem = document.createElement("li");
        listItem.className =
          "relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-t-inherit text-inherit rounded-xl";

        // LEFT Container of list item
        const leftContainer = document.createElement("div");
        leftContainer.className = "flex flex-col";
        const dateTitle = document.createElement("h6");
        dateTitle.className =
          "mb-1 text-sm font-semibold leading-normal text-slate-700";
        const numResults = document.createElement("span");
        numResults.className = "text-xs leading-tight";
        leftContainer.appendChild(dateTitle);
        leftContainer.appendChild(numResults);

        // RIGHT Container of list item
        const rightContainer = document.createElement("div");
        rightContainer.className = "flex items-center text-sm leading-normal";
        const pdfButton = document.createElement("button");
        pdfButton.className =
          "inline-block px-0 mb-0 ml-6 font-bold leading-normal text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer ease-in bg-150 text-sm tracking-tight-rem bg-x-25 text-slate-700 py-2.5 active:opacity-85 hover:-translate-y-px";
        const pdfIcon = document.createElement("i");
        pdfIcon.className = "mr-1 text-lg leading-none bx bxs-file-pdf";
        const pdfText = document.createTextNode(" PDF");
        pdfButton.append(pdfIcon);
        pdfButton.append(pdfText);
        rightContainer.appendChild(pdfButton);

        listItem.appendChild(leftContainer);
        listItem.appendChild(rightContainer);
        historyList.appendChild(listItem);

        // List information
        const date = new Date(resItem.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        });
        dateTitle.textContent = formattedDate;
        numResults.textContent = `Num of Results: ${resItem.count}`;

        // console.log(resItem.date, formattedDate);
      }
    }
  } catch (err) {
    showAlert("error", "There was an error logging you out");
  }
};
