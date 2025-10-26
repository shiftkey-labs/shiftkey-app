import { observable } from "@legendapp/state";
import { getUserRegistrations, getUserUpcomingRegistrations } from "@/api/registrationApi";
import server from "@/config/axios";

const registrationState = observable({
  userRegistrations: [],
});

const fetchUserRegistrations = async (uid: string, type: string = "ALL") => {
  try {
    const registrations = await getUserRegistrations(uid);
    registrationState.userRegistrations.set(Object.values(registrations.records));
  } catch (error) {
    console.error("Failed to fetch user registrations:", error);
  }
};

const registerForEvent = async (userId: string, eventId: string) => {
  try {

    const response = await server.post("/registration/register", {
      userId,
      eventId,
    });

    await fetchUserRegistrations(userId);
  } catch (error) {
    console.error("Failed to register for the event:", error);
    throw error;
  }
};

export { registrationState, fetchUserRegistrations, registerForEvent };
