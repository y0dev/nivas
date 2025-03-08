import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./utilities";

const port = process.env.PORT || 3000;

export const contactUs = async (name, email, phone, message) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/contactUs`,
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    console.log(name, email, phone, message);
    if (res.data.status === "success") {
      showAlert("success", "Message was sent successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("fail", err.response.data);
  }
};

/**
 * Function to send a contact email.
 * @param {string} name - The sender's name.
 * @param {string} email - The sender's email.
 * @param {string} message - The message content.
 */
export const sendContactEmail = async (name, email, message) => {
  try {
    const res = await fetch(`http://localhost:${port}/api/v1/email/contactUs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();
    if (data.status === "success") {
      showAlert("success", "Contact email sent successfully");
    } else {
      throw new Error(data.message || "Failed to send contact email");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

/**
 * Function to send a magic link email.
 * @param {string} email - The recipient's email.
 */
export const sendMagicLinkEmail = async (email) => {
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
      throw new Error(data.message || "Failed to send magic link email");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

