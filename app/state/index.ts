import { eventState, initializeEvents, fetchEventDetails } from "./eventState";
import { userState, initializeUser } from "./userState";
import {
  volunteerState,
  fetchUserVolunteerRegistrations,
} from "./volunteerState";
import { registrationState, fetchUserRegistrations } from "./registrationState";

const state = {
  event: { eventState, initializeEvents, fetchEventDetails },
  user: { userState, initializeUser },
  volunteer: { volunteerState, fetchUserVolunteerRegistrations },
  registration: { registrationState, fetchUserRegistrations },
};

export default state;
