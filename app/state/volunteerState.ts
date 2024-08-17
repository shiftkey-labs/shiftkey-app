import { getVolunteerEvents } from "@/api/volunteerApi";
import { observable } from "@legendapp/state";

const volunteerState = observable({
  userVolunteeredEvents: [],
});

const fetchUserVolunteeredEvents = async (uid: string) => {
  try {
    const volunteeredEvents = await getVolunteerEvents(uid);
    volunteerState.userVolunteeredEvents.set(volunteeredEvents);
    console.log(
      "User volunteered events:",
      volunteerState.userVolunteeredEvents.get()
    );
  } catch (error) {
    console.error("Failed to fetch user volunteered events:", error);
  }
};

export { volunteerState, fetchUserVolunteeredEvents };
