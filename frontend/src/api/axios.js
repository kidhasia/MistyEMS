import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    console.log("🪪 Bearer Token:", req.headers.Authorization);
  } else {
    console.warn("❗ No token found in localStorage");
  }

  return req;
});

export default API;