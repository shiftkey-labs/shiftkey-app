import server from "@/config/axios";

export const createEvent = async (eventData: any) => {
  try {
    const response = await server.post("/event/create", eventData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating event: ${error.message}`);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    console.log("getEventById");

    const response = await server.get(`/event/read/${eventId}`);
    console.log("response", response.data);

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching event: ${error.message}`);
  }
};

export const getAllEvents = async () => {
  try {
    console.log("getAllEvents");

    const response = await server.get("/event/read");

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
};

export const updateEventById = async (eventId: string, updateData: any) => {
  try {
    const response = await server.put(`/event/update/${eventId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating event: ${error.message}`);
  }
};

export const deleteEventById = async (eventId: string) => {
  try {
    await server.delete(`/event/delete/${eventId}`);
  } catch (error) {
    throw new Error(`Error deleting event: ${error.message}`);
  }
};
