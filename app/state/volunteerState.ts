import { assignVolunteerToEvent, getVolunteerEvents } from "@/api/volunteerApi";
import { observable } from "@legendapp/state";
import { userState } from "./userState";

const volunteerState = observable({
  userVolunteeredEvents: [],
});

const fetchUserVolunteeredEvents = async (uid: string) => {
  try {
    const volunteeredEvents = await getVolunteerEvents(uid);
    volunteerState.userVolunteeredEvents.set(volunteeredEvents);

  } catch (error) {
    console.error("Failed to fetch user volunteered events:", error);
  }
};

const volunteerForEvent = async (userId: string, eventId: string) => {
  try {
    userState.role.set("VOLUNTEER");

    const response = await assignVolunteerToEvent({
      userId,
      eventId,
    });
  } catch (error) {
    console.error("Failed to volunteer for event:", error);
  }
};

export { volunteerState, fetchUserVolunteeredEvents, volunteerForEvent };
