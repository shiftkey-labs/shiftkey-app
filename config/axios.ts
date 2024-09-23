import axios from "axios";

export const PROD_URL = "";
export const DEV_URL = "http://192.168.2.65:3000/";

const server = axios.create({
  baseURL: DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
