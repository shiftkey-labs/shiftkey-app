import { getUserById } from "@/api/userApi";
import { observable } from "@legendapp/state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "@/config/axios";

const defaultUserState = {
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  pronouns: "",
  isStudent: "",
  currentDegree: "",
  faculty: "",
  school: "",
  hours: 0,
  university: "",
  program: "",
  year: "",
  isInternational: false,
  role: "",
  token: "",
};

// Initialize the userState with all necessary fields
const userState = observable(defaultUserState);

// Function to initialize the authentication state
const initializeAuth = async () => {
  try {
    const [storedUser, storedToken] = await Promise.all([
      AsyncStorage.getItem("user"),
      AsyncStorage.getItem("token"),
    ]);

    if (storedToken) {
      setAuthToken(storedToken);
    } else {
      setAuthToken(null);
    }

    if (storedUser) {
      const user = JSON.parse(storedUser);
      userState.set({
        ...defaultUserState,
        ...user,
        token: storedToken ?? "",
      });
      return;
    }

    userState.set({
      ...defaultUserState,
      token: storedToken ?? "",
    });
  } catch (error) {
    console.error("Failed to initialize auth:", error);
    userState.set({ ...defaultUserState });
    setAuthToken(null);
  }
};

// Function to initialize the user with data from the backend
const initializeUser = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    console.log("User data:", user);

    const userData = {
      id: user.id,
      firstName: user.fields.firstName || "",
      lastName: user.fields.lastName || "",
      email: user.fields.email || "",
      pronouns: user.fields.pronouns || "",
      isStudent: user.fields.isStudent || "",
      currentDegree: user.fields.currentDegree || "",
      faculty: user.fields.faculty || "",
      school: user.fields.school || "",
      hours: user.fields.hours || 0,
      university: user.fields.university || "",
      program: user.fields.program || "",
      year: user.fields.year || "",
      isInternational: user.fields.isInternational || false,
      role: user.fields.role || "",
    };

    const currentToken = userState.get().token ?? "";

    userState.set({
      ...defaultUserState,
      ...userData,
      token: currentToken,
    });

    // Store user data in AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Failed to initialize user:", error);
  }
};

// Function to check if required user fields are filled
const hasRequiredFields = (user: any) => {
  const requiredFields = ["firstName", "lastName", "pronouns", "isStudent"];

  // Check if all required fields have values
  return requiredFields.every(field => {
    const value = user[field];
    return value && value !== "" && (!Array.isArray(value) || value.length > 0);
  });
};

export { userState, initializeUser, initializeAuth, hasRequiredFields, defaultUserState };
