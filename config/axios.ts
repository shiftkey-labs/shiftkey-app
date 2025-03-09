import axios from "axios";

export const PROD_URL = process.env.BACKEND_URL;

const server = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
