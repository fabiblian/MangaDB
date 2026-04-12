import axios from 'axios'; // Falls du axios nutzt

const API_URL = 'http://localhost:8081/api'; // Dein Backend-Pfad

// WICHTIG: Das 'export' muss direkt vor 'const' stehen!
export const startMangaSession = async (userId, categoryId) => {
    try {
        const response = await axios.post(`${API_URL}/sessions/start`, {
            userId: userId,
            categoryId: categoryId
        });
        return response.data; // Das ist das Session-Objekt vom Backend
    } catch (error) {
        console.error("Fehler beim Starten:", error);
        throw error;
    }
};

export const finishMangaSession = async (sessionId, processedCount) => {
    try {
        const response = await axios.post(`${API_URL}/sessions/finish`, {
            sessionId: sessionId,
            processedCount: processedCount
        });
        return response.data;
    } catch (error) {
        console.error("Fehler beim Beenden:", error);
        throw error;
    }
};