import { getUserRegistrations } from "@/api/registrationApi";
import { observable } from "@legendapp/state";

const registrationState = observable({
  userRegistrations: [],
});

export const fetchUserRegistrations = async (uid: string) => {
  try {
    const registrations = await getUserRegistrations(uid);
    registrationState.userRegistrations.set(Object.values(registrations));
    console.log(
      "User registrations:",
      registrationState.userRegistrations.get()
    );
  } catch (error) {
    console.error("Failed to fetch user registrations:", error);
  }
};

export default registrationState;
