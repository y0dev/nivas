/* eslint-disable */
import "./header/theme";
import "./header/notification";
import "./solutions";
import {
  contactUs,
  sendContactEmail,
  sendMagicLinkEmail
} from "./controller.email";
import {
  downloadResults,
  searchForMLS,
  getSearchHistory,
} from "./controller.mls";
import {
  removeLoginBtn,
  removeSignupBtn,
  removeLogoutBtn,
} from "./controller.navbar";
import {
  signup, login, logout, getUserDetails,
  setCookie, getCookie, getRecentSearches,
  getSavedProperties, updateUserDetails,
  updatePassword, deleteUserAccount, forgotPassword
} from "./controller.user";
import {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  getSubscriptionPlans,
  purchaseSubscription,
  upgradeSubscription,
  downgradeSubscription,
  getUpgradeOptions,
} from "./controller.subscription";
import { subscribe, handleCheckout } from "./controller.stripe";
import { updateChart } from "./dashboard/chart";
import { sidebarToggle } from "./dashboard/navbar";
import { sortTableByColumn } from "./tablesort";

const contactForm = document.querySelector(".form--contact");
const signupForm = document.querySelector(".form--sign-up");
const signupMagicForm = document.querySelector(".form-magic--sign-up");
const loginForm = document.querySelector(".form--login");
const loginMagicForm = document.querySelector(".form-magic--login");
let mainWrapper = document.querySelector(".main-wrapper");
const propertyContainer = document.querySelector(".container.property-container");
const userContainer = document.querySelector(".container.user-dash-container");
const accountSettingsContainer = document.querySelector("#account-settings.container");
const billingContainer = document.querySelector("#billing.container");
const pricingSection = document.querySelector("section#pricing");

const hamburger = document.querySelector("#hamburger");
const navbar = document.querySelector("#navbar");

const cookieBanner = document.querySelector('#cookie-banner');
const acceptCookiesButton = document.querySelector('#accept-cookies');
const declineCookiesButton = document.querySelector('#decline-cookies');

if (hamburger) {
  hamburger.addEventListener("click", () => {
      navbar.classList.toggle("navbar-active");
  });
}


if (userContainer || propertyContainer ||
  accountSettingsContainer || billingContainer) {
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    logout();
  });
  
  // addUserMenuBtn();
  sidebarToggle();
  updateChart();
  if (userContainer) {
    // Load users history
    window.addEventListener("load", () => {
      getSearchHistory();
      getRecentSearches();
      getSavedProperties();
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

  if (accountSettingsContainer) {
    window.addEventListener("load", () => {
      getUserDetails();
    });

    const emailChangeBtn = document.querySelector("#email-change-btn");
    if (emailChangeBtn) {
      emailChangeBtn.addEventListener("click", () => {
        // Call function to handle email change (e.g., show email change form)
        updateUserDetails();
      });
    }

    const forgotPWBtn = document.querySelector("#forgot-pw-btn");
    if (forgotPWBtn) {
      forgotPWBtn.addEventListener("click", () => {
        forgotPassword();
      });
    }

    // Listener for save password button
    const savePwBtn = document.querySelector("#save-pw-btn");
    if (savePwBtn) {
      const currentPassword = document.querySelector("#current-password");
      const newPassword = document.querySelector("#new-password");
      savePwBtn.addEventListener("click", () => {
        // Call function to handle password saving (e.g., validate and update password)
        updatePassword(currentPassword, newPassword);
      });
    }

    const deleteBtn = document.querySelector("#delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        // Ask for confirmation before deleting the account
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmation) {
          deleteUserAccount();
        }
      });
    }
  }

  if (billingContainer) {
    window.addEventListener("load", () => {
      getSubscriptions();
      getSubscriptionPlans();
      getUpgradeOptions();
    });
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
  // removeLogoutBtn();
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
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirmed =
      document.getElementById("confirm-password").value;
    signup(email, password, passwordConfirmed);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

// Theme toggle functionality
if (mainWrapper) {
  let hamburgerBtn;
  let toggleBtn;
  let dark = false;

  function declareElements() {
    hamburgerBtn = document.querySelector(".hamburger-menu");
    mainWrapper = document.querySelector(".main-wrapper");
    toggleBtn = document.querySelector(".toggle-btn");
  }

  declareElements();

  function toggleTheme() {
    let main = document.querySelector("main");
    dark = !dark;

    if (dark) {
      toggleBtn.children[0].classList.add("hidden");
      toggleBtn.children[1].classList.remove("hidden");
    } else {
      toggleBtn.children[0].classList.remove("hidden");
      toggleBtn.children[1].classList.add("hidden");
    }

    let clone = mainWrapper.cloneNode(true);
    clone.classList.add(dark ? "dark" : "light");
    clone.classList.remove(dark ? "light" : "dark");
    clone.classList.add("copy");
    main.appendChild(clone);

    document.body.classList.add("stop-scrolling");

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
}

acceptCookiesButton.addEventListener('click', () => {
  setCookie('cookieConsent', 'true', 365);
  cookieBanner.classList.add('hidden');
});

declineCookiesButton.addEventListener('click', () => {
  setCookie('cookieConsent', 'false', 365);
  cookieBanner.classList.add('hidden');
});

// Check if user has given cookie consent and handle accordingly
function checkCookieConsent(){
  const cookieConsent = getCookie('cookieConsent');
  if (!cookieConsent) {
    // Show the cookie consent banner
    cookieBanner.style.display = 'block';
  } else {
    // Hide the cookie consent banner
    cookieBanner.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', checkCookieConsent);