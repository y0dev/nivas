/* eslint-disable */
import { contactUs } from "./controller.email";
import {
  downloadResults,
  searchForMLS,
  getSearchHistory,
} from "./controller.mls";
import {
  addUserMenuBtn,
  removeLoginBtn,
  removeSignupBtn,
  removeLogoutBtn,
} from "./controller.navbar";
import { signup, login, logout } from "./controller.user";
import { sortTableByColumn } from "./tablesort";

const contactForm = document.querySelector(".form--contact");
const signupForm = document.querySelector(".form--sign-up");
const loginForm = document.querySelector(".form--login");
const showcaseArea = document.querySelector(".showcase-area");
let mainWrapper = document.querySelector(".main-wrapper");
let dashboardContainer = document.querySelector(".container.dash-container");
const settingsContainer = document.querySelector(
  ".container.settings-container"
);
// const error404Container = document.querySelector(".container.404-container");

if (settingsContainer || dashboardContainer) {
  addUserMenuBtn();

  if (settingsContainer) {
    // Remove temp history
    const historyContainer = document.getElementById("history-container");
    while (historyContainer.firstChild) {
      historyContainer.removeChild(historyContainer.firstChild);
    }

    // Load users history
    window.addEventListener("load", () => {
      getSearchHistory();
    });
  }

  if (dashboardContainer) {
    const downloadBtn = document.getElementById("download-pdf");
    const mlsForm = document.querySelector(".form--mls");
    const table = document.getElementById("home-table");
    const tableHeaders = table.querySelectorAll("th");
    // Make clickable the table headers
    tableHeaders.forEach((headerCell) => {
      headerCell.addEventListener("click", () => {
        const headerIdx = Array.prototype.indexOf.call(
          headerCell.parentElement.children,
          headerCell
        );
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(table, headerIdx, !currentIsAscending);
      });
    });

    if (mlsForm) {
      mlsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const mls_input = document.getElementById("mls-input").value;
        searchForMLS(mls_input);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        downloadResults();
      });
    }
  }
}

if (contactForm) {
  removeLogoutBtn();
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;
    contactUs(name, email, phone, message);
  });
} else {
  // const contactUsBtn = document.querySelector(".contact-us-btn");
  // contactUsBtn.remove();
}

if (signupForm) {
  removeSignupBtn();
  removeLogoutBtn();
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirmed =
      document.getElementById("passwordConfirmed").value;
    const name = firstName.concat(" ", lastName);
    signup(name, email, password, passwordConfirmed);
  });
}

if (loginForm) {
  removeLoginBtn();
  removeLogoutBtn();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (mainWrapper) {
  let hamburgerBtn;
  let toggleBtn;

  function declareElements() {
    hamburgerBtn = document.querySelector(".hamburger-menu");
    mainWrapper = document.querySelector(".main-wrapper");
    toggleBtn = document.querySelector(".toggle-btn");
  }

  declareElements();

  function toggleTheme() {
    let main = document.querySelector("main");
    // Clone the wrapper
    dark = !dark;

    // NEED TO FIX
    if (dark) {
      toggleBtn.children[0].classList.add("hidden");
      toggleBtn.children[1].classList.remove("hidden");
    } else {
      toggleBtn.children[0].classList.remove("hidden");
      toggleBtn.children[1].classList.add("hidden");
    }

    let clone = mainWrapper.cloneNode(true);
    if (dark) {
      clone.classList.remove("light");
      clone.classList.add("dark");
      toggleBtn.children[0].classList.add("hidden");
      toggleBtn.children[1].classList.remove("hidden");
    } else {
      clone.classList.remove("dark");
      clone.classList.add("light");
      toggleBtn.children[0].classList.remove("hidden");
      toggleBtn.children[1].classList.add("hidden");
    }
    clone.classList.add("copy");
    main.appendChild(clone);

    document.body.classList.add("stop-scrolling");

    // Remove unnecessary elements
    clone.addEventListener("animationend", () => {
      document.body.classList.remove("stop-scrolling");
      mainWrapper.remove();
      clone.classList.remove("copy");
      declareElements();
      events();
    });
  }

  function events() {
    toggleBtn.addEventListener("click", toggleTheme);
    hamburgerBtn.addEventListener("click", () => {
      mainWrapper.classList.toggle("active");
    });
  }

  events();

  let dark = false;
}
