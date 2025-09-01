import { Event } from "@/types/event";

export interface GroupedEvents {
  date: Date;
  dateString: string;
  isToday: boolean;
  isTomorrow: boolean;
  events: Event[];
}

export const groupEventsByDate = (events: Event[]): GroupedEvents[] => {
  // Get today's date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get tomorrow's date without time
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Group events by date
  const eventsByDate = new Map<string, Event[]>();

  events.forEach((event) => {
    const startDate = event.fields.startDate;
    if (!startDate) return;

    const eventDate = new Date(startDate);
    eventDate.setHours(0, 0, 0, 0);
    
    const dateString = eventDate.toISOString().split('T')[0];
    
    if (!eventsByDate.has(dateString)) {
      eventsByDate.set(dateString, []);
    }
    eventsByDate.get(dateString)!.push(event);
  });

  // Convert to array and sort by date
  const groupedEvents: GroupedEvents[] = Array.from(eventsByDate.entries())
    .map(([dateString, events]) => {
      const date = new Date(dateString + 'T00:00:00');
      const isToday = date.getTime() === today.getTime();
      const isTomorrow = date.getTime() === tomorrow.getTime();

      // Sort events within each day by start time
      const sortedEvents = events.sort((a, b) => {
        const timeA = a.fields.startDate ? new Date(a.fields.startDate).getTime() : 0;
        const timeB = b.fields.startDate ? new Date(b.fields.startDate).getTime() : 0;
        return timeA - timeB;
      });

      return {
        date,
        dateString,
        isToday,
        isTomorrow,
        events: sortedEvents,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return groupedEvents;
};

export const isEventToday = (eventDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  return event.getTime() === today.getTime();
};

export const isEventTomorrow = (eventDate: string): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  return event.getTime() === tomorrow.getTime();
};

export const formatTimeFromDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "Time TBD";
  }
};