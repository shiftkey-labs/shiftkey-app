import userState from "./userState";
import volunteerState from "./volunteerState";
import registrationState from "./registrationState";
import eventState from "./evenState";

const state = {
  event: eventState,
  user: userState,
  volunteer: volunteerState,
  registration: registrationState,
};

export default state;
