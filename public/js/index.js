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
import { signup, login, logout, subscribe } from "./controller.user";
import { updateChart } from "./dashboard/chart";
import { sidebarToggle } from "./dashboard/navbar";
import { sortTableByColumn } from "./tablesort";

const contactForm = document.querySelector(".form--contact");
const signupForm = document.querySelector(".form--sign-up");
const loginForm = document.querySelector(".form--login");
const showcaseArea = document.querySelector(".showcase-area");
let mainWrapper = document.querySelector(".main-wrapper");
let propertyContainer = document.querySelector(".container.property-container");
const userContainer = document.querySelector(".container.user-dash-container");
const pricingSection = document.querySelector("section#pricing");
// const error404Container = document.querySelector(".container.404-container");

if (userContainer || propertyContainer) {
  // addUserMenuBtn();
  sidebarToggle();
  updateChart();
  if (userContainer) {
    // Load users history
    window.addEventListener("load", () => {
      getSearchHistory();
    });
  }

  if (propertyContainer) {
    const downloadBtn = document.getElementById("download-pdf");
    const mlsForm = document.querySelector(".form--mls");
    const table = document.getElementById("property-table");
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

if (pricingSection) {
  const tier1Btn = document.getElementById("tier-1-btn");
  const tier2Btn = document.getElementById("tier-2-btn");
  const tier3Btn = document.getElementById("tier-3-btn");

  // Do something with the element with the ID
  if (tier1Btn && tier2Btn && tier3Btn) {
    tier1Btn.addEventListener("click", () => {
      subscribe("free");
    });

    tier2Btn.addEventListener("click", () => {
      subscribe("basic");
    });

    tier3Btn.addEventListener("click", () => {
      subscribe("premium");
    });
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
