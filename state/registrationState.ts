import { observable } from "@legendapp/state";

const registrationState = observable({
  userRegistrations: [],
});

// Legacy registration functions removed - no longer in use
// Active registration/attendance logic is in volunteer/[eventId].tsx

export { registrationState };
