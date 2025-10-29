import AsyncStorage from "@react-native-async-storage/async-storage";
import state from "@/state";
import { setAuthToken } from "@/config/axiosAuth";
import { hasRequiredFields, defaultUserState } from "@/state/userState";

export const persistAuthSession = async (userData: any, token?: string | null) => {
  state.user.userState.set({
    ...userData,
    token: token ?? "",
  });

  const tasks: Promise<void>[] = [
    AsyncStorage.setItem("user", JSON.stringify(userData)),
  ];

  if (token) {
    tasks.push(AsyncStorage.setItem("token", token));
    setAuthToken(token);
  } else {
    setAuthToken(null);
    tasks.push(AsyncStorage.removeItem("token"));
  }

  await Promise.all(tasks);

  return hasRequiredFields(userData);
};

// Centralized logout function
export const clearAuthSession = async () => {
  try {
    // Clear user state
    state.user.userState.set({ ...defaultUserState });

    // Clear AsyncStorage
    await AsyncStorage.multiRemove(["user", "token"]);

    // Clear auth token from axios headers
    setAuthToken(null);

    return true;
  } catch (error) {
    console.error("Failed to clear auth session:", error);
    return false;
  }
};
