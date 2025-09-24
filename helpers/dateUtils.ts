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

/**
 * Check if a multi-day event should be displayed on the current date
 */
export const isMultiDayEventActive = (event: Event): boolean => {
  if (!event.fields.isMultipleDays || !event.fields.startDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventStartDate = new Date(event.fields.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const numberOfDays = event.fields.numberOfMultipleDays || 1;
  const multipleDayType = event.fields.multipleDayType;

  if (multipleDayType === "Daily") {
    // For daily events, check if today falls within the consecutive days range
    const endDate = new Date(eventStartDate);
    endDate.setDate(endDate.getDate() + numberOfDays - 1);

    return today >= eventStartDate && today <= endDate;
  } else if (multipleDayType === "Weekly") {
    // For weekly events, check if today is the same day of week and within the number of weeks
    const eventDayOfWeek = eventStartDate.getDay();
    const todayDayOfWeek = today.getDay();

    if (eventDayOfWeek !== todayDayOfWeek) {
      return false;
    }

    // Calculate weeks difference
    const diffTime = today.getTime() - eventStartDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    const weeksDiff = Math.floor(diffDays / 7);

    return weeksDiff >= 0 && weeksDiff < numberOfDays;
  }

  return false;
};

/**
 * Get all active dates for a multi-day event
 */
export const getMultiDayEventDates = (event: Event): Date[] => {
  if (!event.fields.isMultipleDays || !event.fields.startDate) {
    console.log('❌ getMultiDayEventDates: Event not multi-day or missing start date', {
      isMultipleDays: event.fields.isMultipleDays,
      hasStartDate: !!event.fields.startDate
    });
    return [];
  }

  const dates: Date[] = [];
  const eventStartDate = new Date(event.fields.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const numberOfDays = event.fields.numberOfMultipleDays || 1;
  const multipleDayType = event.fields.multipleDayType;

  console.log('📊 getMultiDayEventDates: Processing event', {
    numberOfDays,
    multipleDayType,
    startDate: eventStartDate.toLocaleDateString()
  });

  if (multipleDayType === "Daily") {
    // For daily events, add consecutive days
    console.log('📅 Generating daily sessions...');
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(eventStartDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
  } else if (multipleDayType === "Weekly") {
    // For weekly events, add same day of week for specified number of weeks
    console.log('📅 Generating weekly sessions...');
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(eventStartDate);
      date.setDate(date.getDate() + (i * 7));
      dates.push(date);
    }
  } else {
    console.log('⚠️ Unknown multipleDayType:', multipleDayType, 'defaulting to daily');
    // Default to daily if type is unknown
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(eventStartDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
  }

  console.log('✅ Generated', dates.length, 'session dates:', dates.map(d => d.toLocaleDateString()));
  return dates;
};

/**
 * Get which day/week number this is for a multi-day event
 */
export const getMultiDayEventDayNumber = (event: Event, targetDate?: Date): number => {
  if (!event.fields.isMultipleDays || !event.fields.startDate) {
    return 1;
  }

  const checkDate = targetDate || new Date();
  checkDate.setHours(0, 0, 0, 0);

  const eventStartDate = new Date(event.fields.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const multipleDayType = event.fields.multipleDayType;

  if (multipleDayType === "Daily") {
    const diffTime = checkDate.getTime() - eventStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    return diffDays + 1;
  } else if (multipleDayType === "Weekly") {
    const diffTime = checkDate.getTime() - eventStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    const weeksDiff = Math.floor(diffDays / 7);
    return weeksDiff + 1;
  }

  return 1;
};