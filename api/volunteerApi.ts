import server from "@/config/axios";

export const createVolunteer = async (userId: string) => {
  try {
    const response = await server.post("/volunteer/create", { userId });
    return response.data;
  } catch (error: any) {
    throw new Error(`Error updating volunteer status: ${error.message}`);
  }
};

export const assignVolunteerToEvent = async (assignmentData: {
  userId: string;
  shiftId: string;
}) => {
  try {
    const response = await server.post("/volunteer/assign", assignmentData);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error assigning volunteer to event: ${error.message}`);
  }
};

export const getVolunteerById = async (userId: string) => {
  try {
    const response = await server.get(`/volunteer/read/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching volunteer: ${error.message}`);
  }
};

export const getAllVolunteers = async () => {
  try {
    const response = await server.get("/volunteer/read");
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching volunteers: ${error.message}`);
  }
};

export const updateVolunteerById = async (userId: string, updateData: any) => {
  try {
    const response = await server.put(
      `/volunteers/update/${userId}`,
      updateData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error updating volunteer: ${error.message}`);
  }
};

export const deleteVolunteerById = async (userId: string) => {
  try {
    await server.delete(`/volunteer/delete/${userId}`);
  } catch (error: any) {
    throw new Error(`Error deleting volunteer: ${error.message}`);
  }
};

export const getVolunteerEvents = async (userId: string) => {
  try {
    const response = await server.get(`/volunteer/user/${userId}`);

    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching volunteer events: ${error.message}`);
  }
};

export const checkCanTakeShift = async (userId: string, eventId: string) => {
  try {
    const response = await server.get(`/volunteer/can-take-shift/${userId}/${eventId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error checking if user can take shift: ${error.message}`);
  }
};
