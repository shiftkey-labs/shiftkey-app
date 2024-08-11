import server from "@/config/axios";

export const createVolunteer = async (userId: string) => {
  try {
    const response = await server.post("/volunteers/create", { userId });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating volunteer status: ${error.message}`);
  }
};

export const assignVolunteerToEvent = async (assignmentData: {
  userId: string;
  eventId: string;
  shiftDetails?: string;
}) => {
  try {
    const response = await server.post("/volunteers/assign", assignmentData);
    return response.data;
  } catch (error) {
    throw new Error(`Error assigning volunteer to event: ${error.message}`);
  }
};

export const getVolunteerById = async (userId: string) => {
  try {
    const response = await server.get(`/volunteers/read/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching volunteer: ${error.message}`);
  }
};

export const getAllVolunteers = async () => {
  try {
    const response = await server.get("/volunteers/read");
    return response.data;
  } catch (error) {
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
  } catch (error) {
    throw new Error(`Error updating volunteer: ${error.message}`);
  }
};

export const deleteVolunteerById = async (userId: string) => {
  try {
    await server.delete(`/volunteers/delete/${userId}`);
  } catch (error) {
    throw new Error(`Error deleting volunteer: ${error.message}`);
  }
};
