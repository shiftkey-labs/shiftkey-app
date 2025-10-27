import { getEventById, getAllEvents } from "@/api/eventApi";
import { observable } from "@legendapp/state";
import { EventDetails, UpcomingEvent } from "@/types/event";

const eventState = observable({
  events: [] as UpcomingEvent[],
  currentEvent: null as EventDetails | null,
  attendanceContext: {
    parentEventId: null as string | null,
    day: null as number | null,
    dayLabel: null as string | null,
  },
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
    eventState.attendanceContext.set({
      parentEventId:
        (event?.parentEventID && typeof event.parentEventID === "string"
          ? event.parentEventID
          : event?.id) ?? null,
      day: typeof event?.day === "number" ? event.day : null,
      dayLabel:
        (event?.dayLabel && typeof event.dayLabel === "string"
          ? event.dayLabel
          : null),
    });
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};

export { eventState, initializeEvents, fetchEventDetails };
