import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../api/client";
import { LeaderboardApi } from "../../api/leaderboardApi";
import { useAuth } from "../../contexts/AuthContext";
import { formatAverageRating } from "./leaderboardUtils";

function StatCard({ label, value }) {
  return (
    <div className="stats-card">
      <span className="stats-card-label">{label}</span>
      <strong className="stats-card-value">{value}</strong>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");

      try {
        const requests = [LeaderboardApi.list()];

        if (user?.id) {
          requests.push(LeaderboardApi.getUserStats(user.id));
        }

        const [leaderboard, stats] = await Promise.all(requests);
        setEntries(leaderboard);
        setUserStats(stats ?? null);
      } catch (e) {
        setError(getApiErrorMessage(e, "Leaderboard konnte nicht geladen werden"));
      }
    };

    load();
  }, [user?.id]);

  return (
    <div className="leaderboard-stack">
      <div className="page-head">
        <div>
          <h2>Leaderboard</h2>
          <p className="leaderboard-subtitle">
            Ranking nach Anzahl gelesener Mangas mit Status COMPLETED.
          </p>
        </div>
      </div>

      {error ? <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div> : null}

      {userStats ? (
        <section className="leaderboard-panel">
          <div className="leaderboard-panel-head">
            <h3>Deine Statistik</h3>
            <span className="leaderboard-user-tag">{userStats.username}</span>
          </div>
          <div className="stats-card-grid">
            <StatCard label="Gelesen" value={userStats.completedCount} />
            <StatCard label="Am Lesen" value={userStats.readingCount} />
            <StatCard label="Geplant" value={userStats.plannedCount} />
            <StatCard label="Abgebrochen" value={userStats.droppedCount} />
            <StatCard label="Ø Bewertung" value={formatAverageRating(userStats.averageRating)} />
            <StatCard
              label="Dein Rang"
              value={entries.find((entry) => entry.userId === userStats.userId)?.rank ?? "-"}
            />
          </div>
        </section>
      ) : null}

      <section className="leaderboard-panel">
        <div className="leaderboard-panel-head">
          <h3>Alle User</h3>
          <span className="leaderboard-user-tag">{entries.length} Eintraege</span>
        </div>

        {entries.length ? (
          <table className="leaderboard-table" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Rang</th>
                <th>User</th>
                <th>Gelesen</th>
                <th>Am Lesen</th>
                <th>Geplant</th>
                <th>Abgebrochen</th>
                <th>Ø Bewertung</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isCurrentUser = entry.userId === user?.id;

                return (
                  <tr
                    key={entry.userId}
                    className={isCurrentUser ? "leaderboard-row-current" : ""}
                  >
                    <td>
                      <span className="rank-pill">#{entry.rank}</span>
                    </td>
                    <td>{entry.username}</td>
                    <td>{entry.completedCount}</td>
                    <td>{entry.readingCount}</td>
                    <td>{entry.plannedCount}</td>
                    <td>{entry.droppedCount}</td>
                    <td>{formatAverageRating(entry.averageRating)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Noch keine User fuer das Leaderboard vorhanden.</p>
        )}
      </section>
    </div>
  );
}
