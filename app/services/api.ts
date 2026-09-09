// services/api.ts
import axios from "axios";
import Cookies from "js-cookie";
import configs from "~/config";

const TOKEN_COOKIE_KEY = "@SaturnChat:token";

const api = axios.create({
  baseURL: configs.PROD_API_URL, // Substitua pela sua URL base
});

// Interceptor para injetar o Token dinamicamente em TODAS as requisições
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