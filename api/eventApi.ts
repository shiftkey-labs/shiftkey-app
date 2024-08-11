import server from "@/config/axios";

export const createEvent = async (eventData: any) => {
  try {
    const response = await server.post("/events/create", eventData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating event: ${error.message}`);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const response = await server.get(`/events/read/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching event: ${error.message}`);
  }
};

export const getAllEvents = async () => {
  try {
    const response = await server.get("/events/read");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
};

export const updateEventById = async (eventId: string, updateData: any) => {
  try {
    const response = await server.put(`/events/update/${eventId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating event: ${error.message}`);
  }
};

export const deleteEventById = async (eventId: string) => {
  try {
    await server.delete(`/events/delete/${eventId}`);
  } catch (error) {
    throw new Error(`Error deleting event: ${error.message}`);
  }
};
