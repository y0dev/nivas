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

function findHighestPercentile(data) {
  let highestValue = 0;
  let highestPercentile = "25th";

  Object.entries(data).forEach(([key, value]) => {
    if (value > highestValue) {
      highestValue = value;
      highestPercentile = key;
    }
  });

  return highestPercentile;
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
      // console.log(results);

      // Clear table
      const searchResultDiv = document.getElementById("search-results");
      const table = document.getElementById("home-table");
      const tbody = table.tBodies[0];
      for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
      }

      // Add Results to table
      results.forEach((item) => {
        const row = tbody.insertRow();
        const zpidCell = row.insertCell();
        const addressCell = row.insertCell();
        const bedCell = row.insertCell();
        const bathCell = row.insertCell();
        const priceCell = row.insertCell();
        const percentileCell = row.insertCell();
        const availCell = row.insertCell();

        // zpidCell.classList.add("dotted-cell");
        addressCell.classList.add("address");

        const data = {
          "25th": item.percentile25th,
          "50th": item.percentile50th,
          "75th": item.percentile75th,
        };
        const highest = findHighestPercentile(data);
        if (highest === "50th") {
          zpidCell.classList.add("percentile50th");
        } else if (highest === "25th") {
          zpidCell.classList.add("percentile25th");
        } else {
          zpidCell.classList.add("percentile75th");
        }
        zpidCell.textContent = item.zpid;
        percentileCell.textContent = highest;

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
