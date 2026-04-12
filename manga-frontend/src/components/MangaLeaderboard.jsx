import { useState, useEffect } from "react";
// Wir nutzen nur noch die relevanten Funktionen für das Ranking
import { getPopularMangas } from "../services/leaderboard-service";

const MangaLibraryLeaderboard = () => {
    // ==========================================
    // STATES
    // ==========================================
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("global");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        { id: "global", label: "🌍 Alle Genres" },
        { id: "shonen", label: "🔥 Shonen" },
        { id: "seinen", label: "💀 Seinen" },
        { id: "romance", label: "💖 Romance" },
        { id: "fantasy", label: "🧙‍♂️ Fantasy" },
    ];

    // ==========================================
    // EFFECTS
    // ==========================================
    useEffect(() => {
        loadLeaderboard();
    }, [selectedCategory]);

    // ==========================================
    // FUNKTIONEN
    // ==========================================
    const loadLeaderboard = async () => {
        setIsLoading(true);
        try {
            const response = await getPopularMangas(selectedCategory);

            // DEBUG: Schau dir hier an, wie die Struktur aussieht!
            console.log("Rohdaten vom Backend:", response);

            // FIX: Falls dein Backend die Liste in einem Feld wie "content" oder "mangas" versteckt:
            const actualData = Array.isArray(response) ? response : (response.content || response.mangas || []);

            setLeaderboardData(actualData);
        } catch (err) {
            setError("Ranking konnte nicht geladen werden.");
            setLeaderboardData([]); // Fallback auf leeres Array bei Fehler
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const getMedal = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return rank + ".";
    };

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header">
                <h1>🏆 Manga Community Ranking</h1>
                <p>Die beliebtesten Werke und aktivsten Sammler</p>
            </header>

            {/* KATEGORIE-TABS */}
            <div className="leaderboard-tabs">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`tab-button ${selectedCategory === cat.id ? "tab-button--active" : ""
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* LOADING & ERROR STATES */}
            {isLoading && <div className="loading">Manga-Daten werden analysiert...</div>}
            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={loadLeaderboard} className="retry-btn">Erneut versuchen</button>
                </div>
            )}

            {/* RANKING TABELLE */}
            {!isLoading && !error && leaderboardData.length > 0 && (
                <div className="table-responsive">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Manga / Sammler</th>
                                <th>Details</th>
                                <th>Punkte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((item, index) => (
                                <tr key={item.id || index} className="leaderboard-row">
                                    <td className="rank-cell">
                                        {getMedal(index + 1)}
                                    </td>
                                    <td className="username-cell">
                                        {/* Zeigt den Titel (Manga) oder den Username an */}
                                        <strong>{item.title || item.username}</strong>
                                    </td>
                                    <td className="games-cell">
                                        {/* Zeigt Bandnummer oder Anzahl der gelesenen Mangas an */}
                                        {item.volume ? `Band ${item.volume}` : `${item.gamesPlayed || 0} Mangas`}
                                    </td>
                                    <td className="score-cell">
                                        <span className="score-badge">
                                            {item.totalScore || item.popularityScore || 0} XP
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* KEINE DATEN */}
            {!isLoading && !error && leaderboardData.length === 0 && (
                <div className="no-data">
                    <h3>Noch keine Einträge vorhanden</h3>
                    <p>Sei der Erste, der diese Kategorie füllt!</p>
                </div>
            )}
        </div>
    );
};

export default MangaLibraryLeaderboard;