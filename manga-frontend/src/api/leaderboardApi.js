import { api } from "./client";

export const LeaderboardApi = {
  list: async () => (await api.get("/leaderboard")).data,
  getUserStats: async (userId) => (await api.get(`/leaderboard/user/${userId}/stats`)).data,
};
