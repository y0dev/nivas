/* eslint-disable */
import { contactUs } from "./create.email";
import { searchForMLS } from "./create.mls";

const contactForm = document.querySelector(".form--contact");
const mlsForm = document.querySelector(".form--mls");
let mainWrapper = document.querySelector(".main-wrapper");

if (mlsForm) {
  mlsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const mls_input = document.getElementById("mls-input").value;
    searchForMLS(mls_input);
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;
    contactUs(name, email, phone, message);
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
