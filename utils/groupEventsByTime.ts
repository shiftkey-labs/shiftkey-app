import { UpcomingEvent } from "@/types/event";

export interface GroupedEvents {
  today: UpcomingEvent[];
  thisWeek: UpcomingEvent[];
  nextWeek: UpcomingEvent[];
  thisMonth: UpcomingEvent[];
  later: UpcomingEvent[];
}

/**
 * Groups events by time periods: Today, This Week, Next Week, This Month, Later
 * @param events - Array of events with startDate
 * @returns Object with events grouped by time period
 */
export function groupEventsByTime(events: UpcomingEvent[]): GroupedEvents {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // End of current week (Sunday)
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday + 1); // +1 to go to start of next week

  // End of next week (following Sunday)
  const endOfNextWeek = new Date(endOfWeek);
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 7);

  // End of current month
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month

  const groups: GroupedEvents = {
    today: [],
    thisWeek: [],
    nextWeek: [],
    thisMonth: [],
    later: [],
  };

  events.forEach((event) => {
    if (!event.startDate) {
      groups.later.push(event);
      return;
    }

    // Parse ISO date string (2025-01-15T14:00:00.000Z)
    const eventDate = new Date(event.startDate);

    // Reset time to midnight for date-only comparison
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (eventDateOnly.getTime() === today.getTime()) {
      groups.today.push(event);
    } else if (eventDateOnly >= tomorrow && eventDateOnly < endOfWeek) {
      groups.thisWeek.push(event);
    } else if (eventDateOnly >= endOfWeek && eventDateOnly < endOfNextWeek) {
      groups.nextWeek.push(event);
    } else if (eventDateOnly >= endOfNextWeek && eventDateOnly < monthEnd) {
      groups.thisMonth.push(event);
    } else {
      groups.later.push(event);
    }
  });

  return groups;
}
