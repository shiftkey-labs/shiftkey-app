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
  shirtSize: "",
  backgroundCheck: "",
  hours: 0,
  university: "",
  program: "",
  year: "",
  isInternational: false,
  role: "STUDENT",
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
        shirtSize: "",
        backgroundCheck: "",
        hours: 0,
        university: "",
        program: "",
        year: "",
        isInternational: false,
        role: "STUDENT",
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
      shirtSize: user.fields.shirtSize || "",
      backgroundCheck: user.fields.backgroundCheck || "",
      hours: user.fields.hours || 0,
      university: user.fields.university || "",
      program: user.fields.program || "",
      year: user.fields.year || "",
      isInternational: user.fields.isInternational || false,
      role: user.fields.role || "STUDENT",
    };

    userState.set(userData);

    // Store user data in AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Failed to initialize user:", error);
  }
};

export { userState, initializeUser, initializeAuth };
