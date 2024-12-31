import { getUserById } from "@/api/userApi";
import { observable } from "@legendapp/state";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize the userState with all necessary fields
const userState = observable({
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
});

// Function to initialize the authentication state
const initializeAuth = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      userState.set(user);
    } else {
      userState.set({
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
      });
    }
  } catch (error) {
    console.error("Failed to initialize auth:", error);
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

    userState.set(userData);

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

export { userState, initializeUser, initializeAuth, hasRequiredFields };
