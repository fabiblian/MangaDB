import apiClient from "../api/client";
/**
 * Holt die Top 10 der beliebtesten Mangas aus dem Backend.
 * Entspricht dem Java-Endpoint: GET /api/manga/leaderboard/popular
 */
export const getPopularMangas = async () => {
  try {
    console.log("📊 Lade beliebteste Mangas vom Backend...");
    
    // Die URL setzt sich aus dem Base-Pfad des Controllers und dem GetMapping zusammen
    const response = await apiClient.get("/manga/leaderboard/popular");
    
    console.log("✅ Beliebte Mangas geladen:", response.data);
    return response.data; // Gibt eine Liste von MangaLeaderboardDTOs zurück
  } catch (error) {
    console.error("❌ Fehler beim Laden des Manga-Rankings:", error);
    throw error;
  }
};

/**
 * Holt die Statistiken für einen spezifischen User.
 * (Hinweis: Stelle sicher, dass du diesen Endpoint auch in Spring Boot hast)
 */
export const getUserStats = async (userId) => {
  try {
    console.log(`📊 Lade Statistiken für User ${userId}...`);
    
    // Falls dieser Endpoint auch im Manga-Controller liegt:
    const response = await apiClient.get(`/manga/leaderboard/user/${userId}/stats`);
    
    console.log("✅ User Stats geladen:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Fehler beim Laden der User Stats:", error);
    throw error;
  }
};