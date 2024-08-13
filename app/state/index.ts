import { eventState, initializeEvents, fetchEventDetails } from "./eventState";
import { userState, initializeUser } from "./userState";
import {
  volunteerState,
  fetchUserVolunteerRegistrations,
} from "./volunteerState";
import {
  registrationState,
  fetchUserRegistrations,
  registerForEvent,
} from "./registrationState";

const state = {
  event: { eventState, initializeEvents, fetchEventDetails },
  user: { userState, initializeUser },
  volunteer: { volunteerState, fetchUserVolunteerRegistrations },
  registration: {
    registrationState,
    fetchUserRegistrations,
    registerForEvent,
  },
};

export default state;
