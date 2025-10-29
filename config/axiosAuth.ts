import axios from "axios";

// This module provides auth token management for axios
// It's separated to avoid circular dependencies

let axiosInstance: typeof axios | null = null;

export const setAxiosInstance = (instance: typeof axios) => {
  axiosInstance = instance;
};

export const setAuthToken = (token?: string | null) => {
  if (!axiosInstance) {
    console.error("Axios instance not set. Call setAxiosInstance first.");
    return;
  }

  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
