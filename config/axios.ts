import axios from "axios";
import environment from "./environment";

const server = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log current environment for debugging
console.log(`API configured for ${environment.env} environment: ${environment.apiUrl}`);

export default server;
