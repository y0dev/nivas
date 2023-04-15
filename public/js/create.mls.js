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

export const searchForMLS = async (mls_string) => {
  let url, data;
  console.log(mls_string);
  const searchTitle = document.querySelector(".search-results .title");
  const searchTerm = searchTitle.querySelector(".term");
  if (containsZipCode(mls_string)) {
    const zip_code = getZipCode(mls_string);
    searchTerm.textContent = zip_code;
    // console.log(zip_code);
    url = `http://localhost:${process.env.PORT}/api/v1/mls/searchZip`;
    data = {
      zip_code,
    };
  } else if (containsCityAndState(mls_string)) {
    const { city, state } = getCityAndState(mls_string);
    searchTerm.textContent = `${city}, ${state}`;
    // console.log(city, state);
    url = `http://localhost:${process.env.PORT}/api/v1/mls/searchCS`;
    data = {
      city,
      state,
    };
  } else {
    console.log("Failed Parsing");
    showAlert("fail", "Missing");
    return;
  }

  const overlay = document.querySelector(".spinner-overlay");
  try {
    // display loading overlay when making API call
    overlay.style.display = "block";
    const res = await axios({
      method: "POST",
      url: url,
      data: data,
    });

    if (res.data.status === "success") {
      showAlert("success", "MLS finish successfully");
      const results = res.data.results;
      console.log(results);

      // Clear table
      const table = document.getElementById("home-table");
      const tbody = table.tBodies[0];
      for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
      }

      // Add Results to table
      results.forEach((item) => {
        const row = tbody.insertRow();
        const zpidCell = row.insertCell();
        const priceCell = row.insertCell();
        const percentileCell = row.insertCell();
        const addressCell = row.insertCell();
        const availCell = row.insertCell();
        const bedCell = row.insertCell();
        const bathCell = row.insertCell();

        zpidCell.textContent = item.zpid;
        percentileCell.textContent = "25th";
        addressCell.textContent = item.address;
        priceCell.textContent = item.priceStr;
        availCell.textContent = item.status;
        bedCell.textContent = item.beds;
        bathCell.textContent = item.baths;
      });

      const tableDisplay = table.style.display;
      if (tableDisplay === "none") {
        searchTitle.style.display = "block";
        tableDisplay = "block";
      }
      // hide loading overlay after updating table
      overlay.style.display = "none";

      //   window.setTimeout(() => {
      //     location.assign("/");
      //   }, 1500);
    }
  } catch (err) {
    showAlert("fail", err.response.data);
  }
};
