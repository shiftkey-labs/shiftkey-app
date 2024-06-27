import { auth } from "@/config/firebaseConfig";
import {
  fetchEventByIdFromFirebase,
  fetchEventsFromFirebase,
  syncEventsWithFirebase,
} from "@/helpers/eventHelpers";
import { observable } from "@legendapp/state";
import axios from "axios";

const state = observable({
  user: {
    uid: null,
    name: "",
    email: "",
    university: "",
    program: "",
    year: "",
    isInternational: false,
  },
  events: [],
  currentEvent: null,
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

export const initializeAuth = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      state.user.set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        university: "",
        program: "",
        year: "",
        isInternational: false,
      });
    } else {
      state.user.set({
        uid: null,
        name: "",
        email: "",
        university: "",
        program: "",
        year: "",
        isInternational: false,
      });
    }
  });
};

export default state;
