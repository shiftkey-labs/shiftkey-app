export interface GroupedEvents<T = any> {
  today: T[];
  thisWeek: T[];
  nextWeek: T[];
  thisMonth: T[];
  later: T[];
}

interface DateItem {
  startDate?: string | null;
}

/**
 * Groups items by time periods: Today, This Week, Next Week, This Month, Later
 * @param items - Array of items with startDate property
 * @returns Object with items grouped by time period
 */
export function groupEventsByTime<T extends DateItem>(items: T[]): GroupedEvents<T> {
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

  const groups: GroupedEvents<T> = {
    today: [],
    thisWeek: [],
    nextWeek: [],
    thisMonth: [],
    later: [],
  };

  items.forEach((item) => {
    if (!item.startDate) {
      groups.later.push(item);
      return;
    }

    // Parse ISO date string (2025-01-15T14:00:00.000Z)
    const itemDate = new Date(item.startDate);

    // Reset time to midnight for date-only comparison
    const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

    if (itemDateOnly.getTime() === today.getTime()) {
      groups.today.push(item);
    } else if (itemDateOnly >= tomorrow && itemDateOnly < endOfWeek) {
      groups.thisWeek.push(item);
    } else if (itemDateOnly >= endOfWeek && itemDateOnly < endOfNextWeek) {
      groups.nextWeek.push(item);
    } else if (itemDateOnly >= endOfNextWeek && itemDateOnly < monthEnd) {
      groups.thisMonth.push(item);
    } else {
      groups.later.push(item);
    }
  });

  return groups;
}
