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
  images?: any[] | null;
  uid: number | null;
  registration?: boolean;
  volunteerCount?: number;
  shiftsScheduled?: number;
  staffShiftCount?: number;
};
export type Event = {
  id: string;
  fields: EventFields;
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
  onPress: () => void;
  isLoading?: boolean;
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
  };
};

export type DisplayEvent = {
  id: string;
  eventName: string;
  location: string;
  startDate: string;
  images?: Image[];
};