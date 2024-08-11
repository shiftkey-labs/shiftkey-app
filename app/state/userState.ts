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

export { userState, initializeUser };
