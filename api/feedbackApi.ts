import server from "@/config/axios";

export type FeedbackPayload = {
  issue: string;
  reproduce: string;
};

export const submitFeedback = async (payload: FeedbackPayload) => {
  const response = await server.post("/feedback", payload, {
    timeout: 10000,
  });
  return response.data;
};
