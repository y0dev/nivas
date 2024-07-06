import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./utilities";

const port = process.env.PORT || 3000;

/**
 * Function to log in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
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

/**
 * Function to log out a user.
 */
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

/**
 * Function to sign up a user.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @param {string} passwordConfirmation - The user's password confirmation.
 */
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

/**
 * Function to subscribe a user to a plan.
 * @param {string} subscription - The subscription plan.
 */
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

/**
 * Function to purchase a subscription.
 * @param {string} plan - The subscription plan.
 * @param {string} billingInterval - The billing interval (monthly/annual).
 * @param {string} paymentMethodId - The payment method ID.
 */
export const purchaseSubscription = async (plan, billingInterval, paymentMethodId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscriptions/purchase`,
      data: {
        plan,
        billingInterval,
        paymentMethodId,
      },
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Subscription purchased successfully!');
      setTimeout(() => {
        window.location.assign('/dashboard');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

/**
 * Function to show login failure animation.
 */
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