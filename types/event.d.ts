export type EventFields = {
  category1?: string[];
  category2?: string[];
  endDate?: string | null;
  eventDetails?: string | null;
  eventName?: string | null;
  location?: string | null;
  notes?: string | null;
  startDate?: string | null;
  volunteer?: any[] | null;
  volunteerShifts?: any[] | null;
  shiftsAvailable?: string[];
  images?: any[] | null;
  uid: number | null;
  registration?: boolean;
  isActive?: boolean;
  volunteerCount?: number;
  shiftsScheduled?: number;
  staffShiftCount?: number;
  staffOnly?: boolean;
  isMultipleDays?: boolean;
};
export type Event = {
  id: string;
  fields: {
    eventName?: string;
    location?: string;
    startDate?: string;
    eventDetails?: string;
    volunteerCount?: number;
    shiftsScheduled?: number;
    staffShiftCount?: number;
    images?: Array<{ url: string }>;
    registration?: boolean;
    staffOnly?: boolean;
  };
};

export interface Image {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface EventCardProps {
  title: string;
  location: string;
  date: string;
  images?: Image[];
  imageUrl?: string | null;
  onPress: () => void;
  isLoading?: boolean;
  staffOnly?: boolean;
}


export type Registration = {
  id: string;
  attendance: boolean | null;
  email: string[];
  endTime: string[];
  event: string[];
  eventId: string[];
  eventName: string[];
  status: string | null;
  uid: number;
  user: string[];
  userId: string[];
  userName: string[];
  registration: string[];
};

export type DisplayEvent = {
  id: string;
  eventName: string;
  location: string;
  startDate: string;
  images?: Image[];
};

export type UpcomingEvent = {
  id: string;
  eventName: string;
  category: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  image: string | null;
  parentEventID?: string | null;
  registration?: boolean | null;
  isActive?: boolean | null;
  parentRegistrationCount?: number | null;
  day?: number;
  dayLabel?: string | null;
};

export type EventDetails = UpcomingEvent & {
  volunteers?: string[];
  description?: string | null;
  registrationLink?: string | null;
};
