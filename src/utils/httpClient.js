import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
const subscribers = [];

const notifySubscribers = () => {
  while (subscribers.length) {
    const callback = subscribers.shift();
    callback?.();
  }
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register") || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise((resolve) => subscribers.push(resolve));
        return httpClient(originalRequest);
      }

      isRefreshing = true;
      try {
        await httpClient.post("/auth/refresh");
        notifySubscribers();
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      console.error("API error", error.response.status, error.response.data);
    } else {
      console.error("Network error", error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
