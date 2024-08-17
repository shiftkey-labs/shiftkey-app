import { assignVolunteerToEvent, getVolunteerEvents } from "@/api/volunteerApi";
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

const volunteerForEvent = async (userId: string, eventId: string) => {
  try {
    const response = await assignVolunteerToEvent({
      userId,
      eventId,
    });
    console.log("Volunteer assigned:", response);
    // Optionally, update the state with the new volunteer event
    fetchUserVolunteeredEvents(userId);
  } catch (error) {
    console.error("Failed to volunteer for event:", error);
  }
};

export { volunteerState, fetchUserVolunteeredEvents, volunteerForEvent };
