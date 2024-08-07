// state.ts
import { auth } from "@/config/firebaseConfig";
import {
  fetchEventByIdFromFirebase,
  fetchEventsFromFirebase,
  syncEventsWithFirebase,
} from "@/helpers/eventHelpers";
import { getUserBookings, getUserRole } from "@/helpers/userHelpers";
import { observable } from "@legendapp/state";

const state = observable({
  user: {
    uid: null,
    name: "",
    email: "",
    university: "",
    program: "",
    year: "",
    isInternational: false,
    role: "STUDENT",
  },
  events: [],
  currentEvent: null,
  userBookings: [],
});

export const initializeApp = async () => {
  await syncEventsWithFirebase();
  const events = await fetchEventsFromFirebase();
  state.events.set(Object.values(events));
};

export const fetchEventById = async (id: string) => {
  try {
    const event = await fetchEventByIdFromFirebase(id);
    state.currentEvent.set(event);
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};

export const fetchUserBookings = async (uid: string) => {
  try {
    const bookings = await getUserBookings(uid);
    state.userBookings.set(Object.values(bookings));
    console.log("User bookings:", state.userBookings.get());
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
  }
};

export const initializeAuth = () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const role = await getUserRole(user.uid);
      state.user.set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        university: "",
        program: "",
        year: "",
        isInternational: false,
        role,
      });
      fetchUserBookings(user.uid);
    } else {
      state.user.set({
        uid: null,
        name: "",
        email: "",
        university: "",
        program: "",
        year: "",
        isInternational: false,
        role: "STUDENT",
      });
    }
  });
};

export default state;
