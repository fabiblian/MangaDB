import { api } from "./client";

export const UserApi = {
  list: async () => (await api.get("/users")).data,
  get: async (id) => (await api.get(`/users/${id}`)).data,
  create: async (payload) => (await api.post("/users", payload)).data,
  update: async (id, payload) => (await api.put(`/users/${id}`, payload)).data,
  remove: async (id) => api.delete(`/users/${id}`),
};
