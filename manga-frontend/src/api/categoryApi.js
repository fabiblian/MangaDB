import { api } from "./client";

export const CategoryApi = {
  list: async () => (await api.get("/categories")).data,
  create: async (payload) => (await api.post("/categories", payload)).data,
  remove: async (id) => api.delete(`/categories/${id}`),
};
