import axios from "axios";

// Explicitly call the backend on localhost so the UI binds to the backend directly.
const API = axios.create({
  baseURL: "http://localhost:5000/api/products",
  timeout: 10000,
});

export const searchProducts = async (query) => {
  const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const compareProducts = async (query) => {
  const res = await API.get(`/compare?q=${encodeURIComponent(query)}`);
  return res.data;
};
