import axios from "axios";

export const PROD_URL = process.env.BACKEND_URL;
export const V_S = "http://3.136.217.21:3000";
export const DEV_URL = "http://192.168.2.205:3000";

const server = axios.create({
  baseURL: DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
