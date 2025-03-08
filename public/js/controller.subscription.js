import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./utilities";

const port = process.env.PORT || 3000;

/**
 * Function to create a new subscription.
 * @param {string} userId - The user's ID.
 * @param {string} plan - The subscription plan (e.g., basic, premium, VIP).
 * @param {Date} endDate - The end date of the subscription.
 */
export const createSubscription = async (userId, plan, endDate) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscription/create`,
      data: { userId, plan, endDate },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Subscription created successfully");
    }
  } catch (err) {
    showAlert("error", "Failed to create subscription");
  }
};

/**
 * Function to get all subscriptions for the logged-in user.
 */
export const getSubscriptions = async () => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscription/mine`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (err) {
    showAlert("error", "Failed to retrieve subscriptions");
  }
};

/**
 * Function to cancel a subscription.
 * @param {string} subscriptionId - The ID of the subscription to cancel.
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/subscription/cancel?subscriptionId=${subscriptionId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Subscription canceled successfully");
    }
  } catch (err) {
    showAlert("error", "Failed to cancel subscription");
  }
};

/**
 * Function to get available subscription plans.
 */
export const getSubscriptionPlans = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/subscription/plans`,
    });

    return res.data;
  } catch (err) {
    showAlert("error", "Failed to retrieve subscription plans");
  }
};

/**
 * Function to purchase a subscription.
 * @param {string} userId - The user's ID.
 * @param {string} plan - The subscription plan.
 */
export const purchaseSubscription = async (userId, plan) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscription/purchase`,
      data: { userId, plan },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Subscription purchased successfully");
    }
  } catch (err) {
    showAlert("error", "Failed to purchase subscription");
  }
};

/**
 * Function to upgrade a subscription.
 * @param {string} subscriptionId - The ID of the subscription to upgrade.
 */
export const upgradeSubscription = async (subscriptionId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscription/upgrade`,
      data: { subscriptionId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Subscription upgraded successfully");
    }
  } catch (err) {
    showAlert("error", "Failed to upgrade subscription");
  }
};

/**
 * Function to downgrade a subscription.
 * @param {string} subscriptionId - The ID of the subscription to downgrade.
 */
export const downgradeSubscription = async (subscriptionId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/subscription/downgrade`,
      data: { subscriptionId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Subscription downgraded successfully");
    }
  } catch (err) {
    showAlert("error", "Failed to downgrade subscription");
  }
};

/**
 * Function to retrieve available upgrade options.
 */
export const getUpgradeOptions = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/subscription/upgrade-options`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (err) {
    showAlert("error", "Failed to retrieve upgrade options");
  }
};
