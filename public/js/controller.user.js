import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alert";

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
      console.log(res.data);
      // Store token
      localStorage.setItem("token", res.data.token);
      showAlert("success", "Logged in successfully");
      window.setTimeout(() => {
        location.assign("/search");
      }, 1500);
    }
  } catch (err) {
    localStorage.removeItem("token");
    showAlert("fail", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:${port}/api/v1/user/logout`,
    });
    if ((res.data.status = "success")) {
      localStorage.removeItem("token");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "There was an error logging you out");
  }
};

export const signup = async (name, email, password, passwordConfirmation) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:${port}/api/v1/user/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirmation,
      },
    });

    if (res.data.status === "success") {
      console.log(res.data);
      showAlert("success", "signed up successfully");
      window.setTimeout(() => {
        location.assign("/search");
      }, 1500);
    }
  } catch (err) {
    showAlert("fail", err.response.data.message);
  }
};
