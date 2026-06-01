export interface GroupedEvents<T = any> {
  today: T[];
  thisWeek: T[];
  nextWeek: T[];
  thisMonth: T[];
  later: T[];
}

interface DateItem {
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean | null;
}

const parseDateString = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toMidnight = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Groups items by time periods: Today, This Week, Next Week, This Month, Later
 * @param items - Array of items with startDate and optional endDate properties
 * @returns Object with items grouped by time period
 */
export function groupEventsByTime<T extends DateItem>(items: T[]): GroupedEvents<T> {
  const now = new Date();
  const today = toMidnight(now);
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
    const startDate = parseDateString(item.startDate);
    const endDate = parseDateString(item.endDate) ?? startDate;
    const isActive = item.isActive === true;

    if (!startDate) {
      if (isActive) {
        groups.today.push(item);
      } else {
        groups.later.push(item);
      }
      return;
    }

    const startDateOnly = toMidnight(startDate);
    const endDateOnly = endDate ? toMidnight(endDate) : startDateOnly;
    const effectiveEndDate = endDateOnly >= startDateOnly ? endDateOnly : startDateOnly;
    const isCurrentlyActive =
      today.getTime() >= startDateOnly.getTime() &&
      today.getTime() <= effectiveEndDate.getTime();

    if (isActive || isCurrentlyActive) {
      groups.today.push(item);
      return;
    }

    if (startDateOnly >= tomorrow && startDateOnly < endOfWeek) {
      groups.thisWeek.push(item);
    } else if (startDateOnly >= endOfWeek && startDateOnly < endOfNextWeek) {
      groups.nextWeek.push(item);
    } else if (startDateOnly >= endOfNextWeek && startDateOnly < monthEnd) {
      groups.thisMonth.push(item);
    } else {
      groups.later.push(item);
    }
  });

  const sortByStartDateAndActive = (a: T, b: T) => {
    const aStart = parseDateString(a.startDate);
    const bStart = parseDateString(b.startDate);

    if (a.isActive === true && b.isActive !== true) return -1;
    if (b.isActive === true && a.isActive !== true) return 1;

    if (!aStart && !bStart) return 0;
    if (!aStart) return 1;
    if (!bStart) return -1;

    return aStart.getTime() - bStart.getTime();
  };

  groups.today.sort(sortByStartDateAndActive);
  groups.thisWeek.sort(sortByStartDateAndActive);
  groups.nextWeek.sort(sortByStartDateAndActive);
  groups.thisMonth.sort(sortByStartDateAndActive);
  groups.later.sort(sortByStartDateAndActive);

  return groups;
}
