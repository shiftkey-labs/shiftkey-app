// firebaseHelpers/eventHelpers.js
import { ref, get, child, set } from "firebase/database";
import axios from "axios";
import { database } from "@/config/firebaseConfig";

const sanitizeKey = (key: string) => key.replace(/[.#$/[\]]/g, "_");

export const syncEventsWithFirebase = async () => {
  try {
    const response = await axios.get(
      "https://shiftkeylabs.ca/wp-json/tribe/events/v1/events/"
    );
    const events = response.data.events.reduce(
      (
        acc: {
          [x: string]: {
            id: any;
            title: any;
            date: any;
            location: any;
            image: any;
            description: any;
          };
        },
        event: {
          id: { toString: () => any };
          title: any;
          start_date: any;
          venue: string | any[];
          image: { url: any };
          description: any;
        }
      ) => {
        const sanitizedId = sanitizeKey(event.id.toString());
        acc[sanitizedId] = {
          id: event.id,
          title: event.title,
          date: event.start_date,
          location: event.venue.length
            ? event.venue[0].venue
            : "No location provided",
          image: event.image ? event.image.url : null,
          description: event.description,
        };
        return acc;
      },
      {}
    );

    await set(ref(database, "events"), events);
  } catch (error) {
    console.error("Failed to sync events with Firebase:", error);
  }
};

export const fetchEventsFromFirebase = async () => {
  const eventsRef = ref(database, "events");
  const snapshot = await get(eventsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const fetchEventByIdFromFirebase = async (id: string) => {
  const sanitizedId = sanitizeKey(id);
  const eventRef = child(ref(database), `events/${sanitizedId}`);
  const snapshot = await get(eventRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  throw new Error("Event not found");
};
