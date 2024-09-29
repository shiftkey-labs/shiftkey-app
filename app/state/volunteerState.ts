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
    userState.role.set("VOLUNTEER");
    console.log("userState", userState);

    const response = await assignVolunteerToEvent({
      userId,
      eventId,
    });
    console.log("Volunteer assigned:", response);
  } catch (error) {
    console.error("Failed to volunteer for event:", error);
  }
};

export { volunteerState, fetchUserVolunteeredEvents, volunteerForEvent };
