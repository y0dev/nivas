export function removeLoginBtn() {
  // Remove signup nav link from navbar
  const loginBtn = document.querySelector("#login-btn");
  loginBtn.remove();
}

export function removeSignupBtn() {
  // Remove signup nav link from navbar
  const signupBtn = document.querySelector("#sign-up-btn");
  signupBtn.remove();
}

export function addUserImage() {
  removeLoginBtn();
  removeSignupBtn();

  // Add user image to nav bar
  const navBar = document.querySelector("header nav");

  // Create a new a element with the link
  const link = document.createElement("a");
  link.href = "/profile";
  link.classList.add("user-icon");
  link.classList.add("border-0");
  link.classList.add("rounded-full");

  const image = document.createElement("img");
  image.alt = "profile-image";

  link.appendChild(image);
  navBar.appendChild(link);
}
