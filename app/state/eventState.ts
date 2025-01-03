import { getEventById, getAllEvents } from "@/api/eventApi";
import { observable } from "@legendapp/state";

const eventState = observable({
  events: [],
  currentEvent: null,
});

const initializeEvents = async () => {
  try {
    const events = await getAllEvents();
    eventState.events.set(Object.values(events));
  } catch (error) {
    console.error("Failed to initialize events:", error);
  }
};

const fetchEventDetails = async (id: string) => {
  try {
    console.log("fetching event details for id:", id);

    const event = await getEventById(id);
    console.log("fetched event details:", event);

    eventState.currentEvent.set(event);
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};

export { eventState, initializeEvents, fetchEventDetails };
