import { logout } from "./controller.user";
export function removeLoginBtn() {
  // Remove login nav link from navbar
  const loginBtn = document.querySelector("#login-btn");
  loginBtn.classList.add("hide-btn");
}

export function removeSignupBtn() {
  // Remove signup nav link from navbar
  const signupBtn = document.querySelector("#sign-up-btn");
  signupBtn.classList.add("hide-btn");
}

export function removeLogoutBtn() {
  // Remove logout nav link from navbar
  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.classList.add("hide-btn");
}

export function removeHamburgerMenu() {
  // Remove hamburger menu link from navbar
  const hamburgerMenu = document.querySelector("#hamburger");
  hamburgerMenu.classList.add("hide-btn");
}
export function addUserMenuBtn() {
  removeLoginBtn();
  removeSignupBtn();
  removeHamburgerMenu();

  const userDropdownBtn = document.querySelector("#user-menu-button");
  const userDropdown = document.querySelector("#user-dropdown");

  userDropdownBtn.classList.remove("hidden");

  userDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle("hidden");
  });
}
