import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./utilities";

const port = process.env.PORT || 3000;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/user/login`,
      data: {
        email,
        password,
      },
    });
    
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
  } catch (err) {
    localStorage.removeItem("token");
    showLoginFailure();
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/user/logout`,
    });
    if ((res.data.status = "success")) {
      // localStorage.removeItem("token");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "There was an error logging you out");
  }
};

export const signup = async (name, email, username, password, passwordConfirmation) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/user/signup`,
      data: {
        name,
        email,
        username,
        password,
        passwordConfirmation,
      },
    });

    if (res.data.status === "success") {
      // Store token
      // localStorage.setItem("token", res.data.token);
      showAlert("success", "signed up successfully");
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
  } catch (err) {
    // localStorage.removeItem("token");
    showAlert("fail", err.response.data.message);
  }
};

export const subscribe = async (subscription) => {
  try {
    console.log(subscription);
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/user/subscription`,
      data: {
        subscription,
      },
    });
    if (res.data.status === "success") {
      console.log(res.data);
      window.setTimeout(() => {
        location.assign("/signup");
      }, 1500);
    }
  } catch (err) {
    showAlert("fail", err.response.data.message);
  }
};


function showLoginFailure() {
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');

  // Add error class to fields
  emailField.classList.add('input-error');
  passwordField.classList.add('input-error');

  // Remove error class after animation ends
  setTimeout(() => {
    emailField.classList.remove('input-error');
    passwordField.classList.remove('input-error');
  }, 500); // Match this duration to the animation duration
}