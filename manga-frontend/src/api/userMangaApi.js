import { api } from "./client";

export const UserMangaApi = {
  list: async () => (await api.get("/user-manga")).data,
  create: async (payload) => (await api.post("/user-manga", payload)).data,
  update: async (id, payload) => (await api.put(`/user-manga/${id}`, payload)).data,
  remove: async (id) => api.delete(`/user-manga/${id}`),
};
