import axios from "axios";

export const PROD_URL = process.env.BACKEND_URL;
export const DEV_URL = "http://localhost:3000";

const server = axios.create({
  baseURL: DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
