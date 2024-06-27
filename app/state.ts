import { auth } from "@/config/firebaseConfig";
import { observable } from "@legendapp/state";
import axios from "axios";

const state = observable({
  user: {},
  events: [],
  currentEvent: {},
});
export const fetchEvents = async () => {
  try {
    const response = await axios.get(
      "https://shiftkeylabs.ca/wp-json/tribe/events/v1/events/"
    );
    const events = response.data.events.map((event: any) => ({
      id: event.id,
      title: event.title,
      date: event.start_date,
      location: event.venue ? event.venue.venue : "No location provided",
      image: event.image ? event.image.url : null,
      description: event.description,
      booked: false,
    }));
    state.events.set(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
};

export const fetchEventById = async (id: string) => {
  try {
    const response = await axios.get(
      `https://shiftkeylabs.ca/wp-json/tribe/events/v1/events/${id}`
    );
    const event = {
      id: response.data.id,
      title: response.data.title,
      date: response.data.start_date,
      location: response.data.venue
        ? response.data.venue.venue
        : "No location provided",
      image: response.data.image ? response.data.image.url : null,
      description: response.data.description,
    };
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
