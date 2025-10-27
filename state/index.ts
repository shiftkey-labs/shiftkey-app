import { eventState, initializeEvents, fetchEventDetails } from "./eventState";
import { userState, initializeUser } from "./userState";
import {
  fetchUserVolunteeredEvents,
  volunteerForEvent,
  volunteerState,
} from "./volunteerState";
import { registrationState } from "./registrationState";

const state = {
  event: { eventState, initializeEvents, fetchEventDetails },
  user: { userState, initializeUser },
  volunteer: { volunteerState, fetchUserVolunteeredEvents, volunteerForEvent },
  registration: {
    registrationState,
  },
};

export default state;
