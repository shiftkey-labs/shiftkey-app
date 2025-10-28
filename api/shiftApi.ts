import server from "@/config/axios";

const handleShiftError = (error: any, defaultMessage: string) => {
  const status = error?.response?.status;

  if (status === 302) {
    const redirectError = new Error("Shift request redirected");
    (redirectError as any).status = 302;
    (redirectError as any).location = error?.response?.headers?.location;
    throw redirectError;
  }

  const wrappedError = new Error(
    `${defaultMessage}: ${error?.message ?? "Unknown error"}`
  );
  (wrappedError as any).status = status;
  throw wrappedError;
};

const fetchShifts = async (
  params: Record<string, string | undefined> = {},
  defaultMessage: string
) => {
  try {
    const response = await server.get("/shifts", {
      timeout: 10000,
      params,
    });
    return response.data;
  } catch (error: any) {
    handleShiftError(error, defaultMessage);
  }
};

export const getAvailableShifts = async () =>
  fetchShifts({}, "Error fetching available shifts");

export const getBookedShifts = async () =>
  fetchShifts(
    {
      show: "booked",
    },
    "Error fetching booked shifts"
  );

export const getPastShifts = async () =>
  fetchShifts(
    {
      show: "past",
    },
    "Error fetching past shifts"
  );

export const getShiftById = async (shiftId: string) => {
  try {
    const response = await server.get(`/shifts/${shiftId}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error: any) {
    handleShiftError(error, "Error fetching shift details");
  }
};

export const claimShift = async (shiftId: string) => {
  try {
    const response = await server.patch(
      `/shifts/${shiftId}`,
      {
        action: "claim",
      },
      {
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    handleShiftError(error, "Error taking shift");
  }
};

export const dropShift = async (shiftId: string) => {
  try {
    const response = await server.patch(
      `/shifts/${shiftId}`,
      {
        action: "drop",
      },
      {
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    handleShiftError(error, "Error dropping shift");
  }
};
