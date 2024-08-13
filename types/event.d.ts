export type EventFields = {
  category1?: string[];
  category2?: string[];
  endDate?: string | null;
  eventDetails?: string | null;
  eventName?: string | null;
  location?: string | null;
  manualTotalAttendees?: number | null;
  manualTotalInternationalStudents?: number | null;
  manualTotalNonDalFCSStudents?: number | null;
  manualTotalNonStudentsCommunity?: number | null;
  manualTotalNonStudentsFacultyStaff?: number | null;
  manualTotalNonStudentsFederalGov?: number | null;
  manualTotalNonStudentsMunicipalGov?: number | null;
  manualTotalNonStudentsNonProfit?: number | null;
  manualTotalNonStudentsPrivateSector?: number | null;
  manualTotalNonStudentsProvincialGov?: number | null;
  manualTotalNovaScotianStudents?: number | null;
  manualTotalOutOfProvinceStudents?: number | null;
  manualTotalPOC?: number | null;
  manualTotalWomenNonBinary?: number | null;
  manualTotalYouthP12?: number | null;
  notes?: string | null;
  startDate?: string | null;
  totalAttendees?: number | null;
  totalInternationalStudents?: number | null;
  totalNonDalFCSStudents?: number | null;
  totalNonStudentsCommunity?: number | null;
  totalNonStudentsFacultyStaff?: number | null;
  totalNonStudentsFederalGov?: number | null;
  totalNonStudentsMunicipalGov?: number | null;
  totalNonStudentsNonProfit?: number | null;
  totalNonStudentsPrivateSector?: number | null;
  totalNonStudentsProvincialGov?: number | null;
  totalNovaScotianStudents?: number | null;
  totalOutOfProvinceStudents?: number | null;
  totalPOC?: number | null;
  totalWomenNonBinary?: number | null;
  totalYouthP12?: number | null;
  volunteer?: any[] | null;
  volunteerShifts?: any[] | null;
  images?: any[] | null;
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
  images: Image[];
  onPress: () => void;
}
