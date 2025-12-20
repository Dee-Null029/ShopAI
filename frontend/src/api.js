import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products"
});

export const searchProducts = async (query) => {
  const res = await API.get(`/search?q=${query}`);
  return res.data;
};

export const compareProducts = async (query) => {
  const res = await API.get(`/compare?q=${query}`);
  return res.data;
};
