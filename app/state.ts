import { observable } from "@legendapp/state";
import axios from "axios";

const state = observable({
  user: {
    name: "Vansh Sood",
    email: "vanshsood@dal.ca",
  },
  events: [],
  currentEvent: {},
});

export const fetchEvents = async () => {
  const url = process.env.EXPO_API_URL || "http://localhost:3000/events";
  try {
    const response = await axios.get(
      "https://shiftkeylabs.ca/wp-json/tribe/events/v1/events/"
    );

    const events = response.data.events.map((event: any) => ({
      id: event.id,
      title: event.title,
      date: event.start_date,
      location: event.venue ? event.venue.venue : "No location provided",
      image: event.image.url,
      description: event.description,
      speaker: event.speaker ? event.speaker : "Shiftkey Labs",
      speakerImage: event.speaker_image
        ? event.speaker_image
        : require("@/assets/images/adaptive-icon.png"),
    }));
    console.log(
      "Fetched events:",
      events[0].id,
      events[0].title,
      events[0].location,
      events[0].date,
      events[0].image
    );

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
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }
};

export default state;
