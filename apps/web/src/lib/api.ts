import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api`,
  withCredentials: true
});

let fallbackToken: string | null = localStorage.getItem("token");

api.interceptors.request.use((config) => {
  if (fallbackToken) config.headers.Authorization = `Bearer ${fallbackToken}`;
  return config;
});

export function setToken(token: string | null) {
  fallbackToken = token;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export default api;
