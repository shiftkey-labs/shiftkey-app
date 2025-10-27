import axios from "axios";
import { Alert } from "react-native";
import environment from "./environment";

const server = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: function (status) {
    // Accept 2xx, 302, and 304 as valid responses
    return (status >= 200 && status < 300) || status === 302 || status === 304;
  },
});

// Global response interceptor to handle errors and success:false responses
server.interceptors.response.use(
  (response) => {
    // Check if response has success:false
    if (response.data && response.data.success === false) {
      const errorMessage = response.data.message || "An error occurred";
      Alert.alert("Error", errorMessage);

      // Still reject so calling code can handle it
      const error: any = new Error(errorMessage);
      error.response = response;
      return Promise.reject(error);
    }

    // 302 and 304 responses are valid - just return the response as-is
    return response;
  },
  (error) => {
    // Extract error message from server response
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";

    // Show alert for 400+ errors
    if (status && status >= 400) {
      Alert.alert("Error", errorMessage);
    }

    // Log errors for debugging
    console.error('API Error:', errorMessage, error.config?.url);
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
