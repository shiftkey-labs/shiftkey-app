import { getEventById, getAllEvents } from "@/api/eventApi";
import { observable } from "@legendapp/state";
import { EventDetails, UpcomingEvent } from "@/types/event";

const eventState = observable({
  events: [] as UpcomingEvent[],
  currentEvent: null as EventDetails | null,
});

const initializeEvents = async () => {
  try {
    const response = await getAllEvents();
    const events = response?.events ?? [];
    eventState.events.set(events);
  } catch (error) {
    console.error("Failed to initialize events:", error);
  }
};

const fetchEventDetails = async (id: string) => {
  try {
    const response = await getEventById(id);
    const event = response?.event ?? null;

    eventState.currentEvent.set(event);
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};

export { eventState, initializeEvents, fetchEventDetails };
