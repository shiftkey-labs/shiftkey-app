import axios from "axios";

export const PROD_URL = process.env.BACKEND_URL;

const server = axios.create({
  baseURL: "http://192.168.2.77:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
