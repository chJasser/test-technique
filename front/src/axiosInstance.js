import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
});

export const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    instance.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete instance.defaults.headers.common["Authorization"];
  }
};

export default instance;
