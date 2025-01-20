import axios from "axios";

export const PROD_URL = process.env.BACKEND_URL;


const server = axios.create({
  baseURL: "https://shiftkey.vanshsood.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;
