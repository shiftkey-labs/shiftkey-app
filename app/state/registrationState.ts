import { observable } from "@legendapp/state";
import { getUserRegistrations } from "@/api/registrationApi";
import axios from "axios";
import server from "@/config/axios";

const registrationState = observable({
  userRegistrations: [],
});

const fetchUserRegistrations = async (uid: string) => {
  try {
    const registrations = await getUserRegistrations(uid);
    registrationState.userRegistrations.set(Object.values(registrations));
  } catch (error) {
    console.error("Failed to fetch user registrations:", error);
  }
};

const registerForEvent = async (userId: string, eventId: string) => {
  try {
    console.log("Registering for event:", userId, eventId);

    const response = await server.post("/registration/register", {
      userId,
      eventId,
    });
    console.log("Registration successful:", response.data);

    await fetchUserRegistrations(userId);
  } catch (error) {
    console.error("Failed to register for the event:", error);
    throw error;
  }
};

export { registrationState, fetchUserRegistrations, registerForEvent };
