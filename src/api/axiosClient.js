import axios from "axios";

// Create an instance of axios
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here if needed
// For example, to add auth token to headers for every request:
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
