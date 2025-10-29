import axios from "axios";
import environment from "./environment";
import { setAxiosInstance, setAuthToken } from "./axiosAuth";
import { clearAuthSession } from "@/state/authSession";
import { Alert } from "@/utils/alert";

// Global callback for handling navigation after logout
let globalNavigateToLogin: (() => void) | null = null;

export const setNavigateToLogin = (callback: () => void) => {
  globalNavigateToLogin = callback;
};

const server = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache", // Disable caching
  },
  validateStatus: function (status) {
    // Accept 2xx, 302, and 304 as valid responses
    return (status >= 200 && status < 300) || status === 302 || status === 304;
  },
});

setAxiosInstance(server);

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
  async (error) => {
    // Extract error message from server response
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";

    // Handle 401 Unauthorized - Invalid or expired token
    if (status === 401 && errorMessage.toLowerCase().includes("invalid or expired token")) {
      console.log("Token expired - logging out user");

      // Clear auth session
      await clearAuthSession();

      // Navigate to login if callback is set
      if (globalNavigateToLogin) {
        globalNavigateToLogin();
      }

      // Show alert to user
      Alert.alert("Session Expired", "Your session has expired. Please log in again.");

      return Promise.reject(error);
    }

    // Show alert for other 400+ errors
    if (status && status >= 400) {
      Alert.alert("Error", errorMessage);
    }

    // Log errors for debugging
    console.error('API Error:', errorMessage, error.config?.url);
    return Promise.reject(error);
  }
);

// Log current environment for debugging
console.log(`API configured for ${environment.env} environment: ${environment.apiUrl}`);

export { setAuthToken };
export default server;
