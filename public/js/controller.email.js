import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alert";

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
