import { api } from "./client";

export const PublisherApi = {
  list: async () => (await api.get("/publishers")).data,
  get: async (id) => (await api.get(`/publishers/${id}`)).data,
  create: async (payload) => (await api.post("/publishers", payload)).data,
  update: async (id, payload) => (await api.put(`/publishers/${id}`, payload)).data,
  remove: async (id) => api.delete(`/publishers/${id}`),
};
