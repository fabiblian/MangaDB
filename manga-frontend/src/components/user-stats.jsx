import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserStats } from "../services/leaderboard-service";
import api from "../api/client";

const UserStats = () => {
  // ==========================================
  // AUTH CONTEXT
  // ==========================================
  const { user, isAuthenticated } = useAuth();

  // ==========================================
  // STATES
  // ==========================================
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // EFFEKTE
  // ==========================================
  
  /**
   * Lädt User-Stats beim Component-Mount
   * Nur wenn User eingeloggt ist!
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserStats();
    }
  }, [isAuthenticated, user]); // ← Läuft wenn sich Auth-Status ändert

  // ==========================================
  // FUNKTIONEN
  // ==========================================

  /**
   * Lädt die Stats vom Backend
   */
  const loadUserStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserStats(user.id);
      setStats(data);
      console.log("✅ User Stats geladen:", data);
    } catch (err) {
      console.error("❌ Fehler beim Laden der Stats:", err);
      setError("Fehler beim Laden der Statistiken");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RENDER: Nicht eingeloggt
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="user-stats-container">
        <div className="no-auth">
          <h2>Login erforderlich</h2>
          <p>Du musst eingeloggt sein, um deine Statistiken zu sehen.</p>
          <a href="/login" className="button">
            Zum Login
          </a>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Loading
  // ==========================================
  if (isLoading) {
    return (
      <div className="user-stats-container">
        <div className="loading">
          <h3>Lädt deine Statistiken...</h3>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Error
  // ==========================================
  if (error) {
    return (
      <div className="user-stats-container">
        <div className="error">
          <h3>{error}</h3>
          <button onClick={loadUserStats} className="button">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Stats Cards
  // ==========================================
  return (
    <div className="user-stats-container">
      <div className="stats-header">
        <h1>Meine Statistiken</h1>
        <p className="stats-username">
          Spieler: <strong>{stats?.username || user.username}</strong>
        </p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        
        {/* CARD 1: Games Played */}
        <div className="stat-card stat-card--games">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <h3 className="stat-label">Spiele gespielt</h3>
            <p className="stat-value">{stats?.gamesPlayed || 0}</p>
          </div>
        </div>

        {/* CARD 2: Total Score */}
        <div className="stat-card stat-card--score">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-label">Gesamtpunkte</h3>
            <p className="stat-value">{stats?.totalScore || 0}</p>
          </div>
        </div>

        {/* CARD 3: Average Score */}
        <div className="stat-card stat-card--average">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-label">Durchschnitt</h3>
            <p className="stat-value">
              {stats?.averageScore 
                ? stats.averageScore.toFixed(1) 
                : "0.0"}
            </p>
          </div>
        </div>
      </div>

      {/* KEINE SPIELE GESPIELT */}
      {stats?.gamesPlayed === 0 && (
        <div className="no-games">
          <h3>Noch keine Spiele gespielt</h3>
          <p>Spiele dein erstes Quiz, um deine Statistiken zu sehen!</p>
          <a href="/quiz" className="button">
            Quiz starten
          </a>
        </div>
      )}

      {/* REFRESH BUTTON */}
      <div className="stats-actions">
        <button onClick={loadUserStats} className="button button--secondary">
          Aktualisieren
        </button>
      </div>
    </div>
  );
};

export default UserStats;