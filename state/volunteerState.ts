import { assignVolunteerToEvent, getVolunteerEvents, checkCanTakeShift } from "@/api/volunteerApi";
import { observable } from "@legendapp/state";
import { userState } from "./userState";

// Define a type for shift
type Shift = {
  id: string;
  shiftTime: string;
  isAvailable: boolean;
};

const volunteerState = observable({
  userVolunteeredEvents: [],
  canTakeShiftStatus: {
    canTakeShift: false,
    reason: "",
    allShifts: [] as Shift[]
  }
});

const fetchUserVolunteeredEvents = async (uid: string) => {
  try {
    const volunteeredEvents = await getVolunteerEvents(uid);
    volunteerState.userVolunteeredEvents.set(volunteeredEvents);

  } catch (error) {
    console.error("Failed to fetch user volunteered events:", error);
  }
};

const volunteerForEvent = async (userId: string, shiftId: string) => {
  try {
    userState.role.set("VOLUNTEER");

    const response = await assignVolunteerToEvent({
      userId,
      shiftId,
    });
  } catch (error) {
    console.error("Failed to volunteer for event:", error);
  }
};

const checkUserCanTakeShift = async (userId: string, eventId: string) => {
  try {
    const response = await checkCanTakeShift(userId, eventId);
    volunteerState.canTakeShiftStatus.set(response);
    return response;
  } catch (error) {
    console.error("Failed to check if user can take shift:", error);
    return {
      canTakeShift: false,
      reason: "Error checking shift availability",
      allShifts: []
    };
  }
};

export { volunteerState, fetchUserVolunteeredEvents, volunteerForEvent, checkUserCanTakeShift };
