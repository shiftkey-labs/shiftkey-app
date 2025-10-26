import axios from "axios";
import environment from "./environment";

const server = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

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
