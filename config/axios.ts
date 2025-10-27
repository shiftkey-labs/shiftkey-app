import axios from "axios";
import environment from "./environment";

const server = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: function (status) {
    // Accept 2xx and 304 as valid responses
    return (status >= 200 && status < 300) || status === 304;
  },
});

// Global response interceptor to handle 304 Not Modified
server.interceptors.response.use(
  (response) => {
    // 304 responses are valid - just return the response as-is
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string | null) => {
  if (token) {
    server.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete server.defaults.headers.common.Authorization;
  }
};

// Log current environment for debugging
console.log(`API configured for ${environment.env} environment: ${environment.apiUrl}`);

export default server;
