import server from "@/config/axios";

export const getAvailableShifts = async () => {
  try {
    const response = await server.get("/shift/available");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching available shifts: ${error.message}`);
  }
};

export const claimShift = async (shiftId: string, userId: string) => {
  try {
    const response = await server.post(`/shift/claim/${shiftId}`, { userId });
    return response.data;
  } catch (error) {
    throw new Error(`Error claiming shift: ${error.message}`);
  }
};