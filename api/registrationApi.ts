import server from "@/config/axios";

export const registerUserForEvent = async (registrationData: {
  userId: string;
  eventId: string;
}) => {
  try {
    const response = await server.post(
      "/registration/register",
      registrationData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error registering for event: ${error.message}`);
  }
};

export const getUserRegistrations = async (userId: string) => {
  try {
    const response = await server.get(`/registration/user/${userId}/events`);
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching user registrations: ${error.message}`);
  }
};
