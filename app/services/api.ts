// services/api.ts
import axios from "axios";
import Cookies from "js-cookie";
import configs from "~/config";

const TOKEN_COOKIE_KEY = "@SaturnChat:token";

export const isProduction = import.meta.env.PROD;

const api = axios.create({
  baseURL: isProduction ? configs.PROD_API_URL : configs.PROD_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;