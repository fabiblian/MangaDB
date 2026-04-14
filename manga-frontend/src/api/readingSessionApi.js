import { api } from "./client";

export const ReadingSessionApi = {
  list: async () => (await api.get("/reading-sessions")).data,
  create: async (payload) => (await api.post("/reading-sessions", payload)).data,
  remove: async (id) => api.delete(`/reading-sessions/${id}`),
};
