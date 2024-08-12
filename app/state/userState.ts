import { getUserById } from "@/api/userApi";
import { observable } from "@legendapp/state";

const userState = observable({
  uid: null,
  name: "",
  email: "",
  university: "",
  program: "",
  year: "",
  isInternational: false,
  role: "STUDENT",
});

const initializeUser = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    userState.set({
      uid: user.id,
      name: user.fields.name,
      email: user.fields.email,
      university: user.fields.university || "",
      program: user.fields.program || "",
      year: user.fields.year || "",
      isInternational: user.fields.isInternational || false,
      role: user.fields.role || "STUDENT",
    });
  } catch (error) {
    console.error("Failed to initialize user:", error);
  }
};

const initializeAuth = async () => {
  // Check if user data is stored (e.g., in local storage or a secure store)
  const storedUser = localStorage.getItem("user"); // or use SecureStore for mobile apps
  if (storedUser) {
    const user = JSON.parse(storedUser);
    userState.set(user);
  } else {
    // If no user data, initialize with default values or redirect to login
    userState.set({
      uid: null,
      name: "",
      email: "",
      university: "",
      program: "",
      year: "",
      isInternational: false,
      role: "STUDENT",
    });
  }
};

export { userState, initializeUser, initializeAuth };
