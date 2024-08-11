import { getUserRegistrations } from "@/api/registrationApi";
import { observable } from "@legendapp/state";

const volunteerState = observable({
  userRegistrations: [],
});

const fetchUserVolunteerRegistrations = async (uid: string) => {
  try {
    const registrations = await getUserRegistrations(uid);
    volunteerState.userRegistrations.set(Object.values(registrations));
    console.log(
      "User volunteer registrations:",
      volunteerState.userRegistrations.get()
    );
  } catch (error) {
    console.error("Failed to fetch user volunteer registrations:", error);
  }
};

export { volunteerState, fetchUserVolunteerRegistrations };
