import AsyncStorage from "@react-native-async-storage/async-storage";
import state from "@/state";
import { setAuthToken } from "@/config/axios";
import { hasRequiredFields } from "@/state/userState";

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
