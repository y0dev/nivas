import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./utilities";

const port = process.env.PORT || 3000;
/**
 * Function to initiate the checkout process for a subscription.
 * Retrieves the user's authentication token from local storage and sends a request
 * to create a Stripe checkout session.
 * 
 * @param {string} priceId - The Stripe price ID for the selected subscription plan.
 * @param {string} subscription - The name of the subscription plan.
 */
export const handleCheckout = async (priceId, subscriptionTier) => {
  try {
    // Retrieve authentication token from local storage
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    // Send request to create a Stripe checkout session
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/payments/create-checkout-session`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        priceId: priceId,
        tier: subscriptionTier
      },
    });

    // Redirect user to dashboard upon successful session creation
    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
  } catch (err) {
    // Handle errors by removing the token and showing login failure message
    localStorage.removeItem("token");
    handleCheckoutFailure("new", "Payment method was declined.");
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
 * Function to handle failed checkout attempts.
 * Displays appropriate messages based on the type of failure.
 * 
 * @param {string} type - The type of checkout failure (e.g., "new", "update", "cancel").
 * @param {string} message - The error message to display.
 */
export const handleCheckoutFailure = (type, message) => {
  let errorMessage = "An error occurred during checkout. Please try again.";

  switch (type) {
    case "new":
      errorMessage = "Failed to create a new subscription. Please check your payment details and try again.";
      break;
    case "update":
      errorMessage = "Failed to update your subscription. Please verify your plan details.";
      break;
    case "cancel":
      errorMessage = "Subscription cancellation failed. Please contact support if the issue persists.";
      break;
    default:
      errorMessage = message || errorMessage;
  }

  console.error(`Checkout Error (${type}):`, message);
  
  // Display error to user (modify this based on your UI implementation)
  alert(errorMessage); // You can replace this with a custom modal or notification
};
