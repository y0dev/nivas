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
export const signup = async (email, password, passwordConfirmation) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/user/signup`,
      data: {
        email,
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

// Set a cookie
export const setCookie = async (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
  
  // Send consent information to the backend if accepted
  if (name === 'cookieConsent') {
    try {
      const res = await axios({
        method: "POST",
        url: `http://localhost:${port}/api/v1/user/cookie-consent`,
        data: {
          value,
        },
      });
      
      if (res.data.status === 'success') {
        console.log('Cookie consent stored in the database.');
      }
    } catch (err) {
      showAlert('error', err);
      console.error('Error storing cookie consent in the database:', error);
    }
  }
}

// Get a cookie value
export const getCookie = async (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Function to get the current logged-in user's details.
 */
export const getUserDetails = async () => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,  // Assuming token is stored in localStorage
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      // Handle success (populate user details on the page)
      console.log(data.user);
    } else {
      throw new Error(data.message || "Failed to retrieve user details");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to get search history for the user based on period (week, twoWeeks, or month).
 * @param {string} period - Time period for search history ('week', 'twoWeeks', or 'month')
 */
export const getSearchHistory = async (period) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/search-history/${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      console.log(data.searchHistory);
    } else {
      throw new Error(data.message || "Failed to retrieve search history");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to initiate password reset email for forgot password.
 * @param {string} email - The email address to send reset link to.
 */
export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "Password reset email sent");
    } else {
      throw new Error(data.message || "Failed to send password reset email");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to reset the user's password using the provided token.
 * @param {string} token - The password reset token from the email.
 * @param {string} newPassword - The new password.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "Password reset successfully");
    } else {
      throw new Error(data.message || "Failed to reset password");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to send a magic link email for login.
 * @param {string} email - The email address to send the magic link to.
 */
export const sendMagicLink = async (email) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/email/send-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "Magic link sent successfully");
    } else {
      throw new Error(data.message || "Failed to send magic link");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to retrieve billing details of the logged-in user.
 */
export const getBillingDetails = async () => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/billing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      console.log(data.billing);
    } else {
      throw new Error(data.message || "Failed to retrieve billing details");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to get recent searches of the logged-in user.
 */
export const getRecentSearches = async () => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/recent-searches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      console.log(data.recentSearches);
    } else {
      throw new Error(data.message || "Failed to retrieve recent searches");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to get saved properties of the logged-in user.
 */
export const getSavedProperties = async () => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/saved-properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      console.log(data.savedProperties);
    } else {
      throw new Error(data.message || "Failed to retrieve saved properties");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to update the user's password.
 * @param {string} currentPassword - The current password.
 * @param {string} newPassword - The new password.
 */
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/update/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "Password updated successfully");
    } else {
      throw new Error(data.message || "Failed to update password");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to update the user's details (email, name, etc.).
 * @param {string} name - The user's new name.
 * @param {string} email - The user's new email.
 */
export const updateUserDetails = async (name, email) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/user/update/details`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "User details updated successfully");
    } else {
      throw new Error(data.message || "Failed to update user details");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to delete the user's account (with confirmation before running).
 */
export const deleteUserAccount = async () => {
  const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (confirmDelete) {
    try {
      const res = await fetch(`http://localhost:${port}/api/v1/user/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        showAlert("success", "Account deleted successfully");
        // Redirect to logout or landing page
        window.location.href = "/";
      } else {
        throw new Error(data.message || "Failed to delete account");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  }
};

