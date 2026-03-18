import { api } from "./client";

export const MangaApi = {
  list: async () => (await api.get("/mangas")).data,
  get: async (id) => (await api.get(`/mangas/${id}`)).data,
  create: async (payload) => (await api.post("/mangas", payload)).data,
  update: async (id, payload) => (await api.put(`/mangas/${id}`, payload)).data,
  remove: async (id) => api.delete(`/mangas/${id}`),
};
