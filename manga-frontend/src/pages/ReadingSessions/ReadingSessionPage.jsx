import { useEffect, useMemo, useState } from "react";
import { api, getApiErrorMessage } from "../../api/client";
import { ReadingSessionApi } from "../../api/readingSessionApi";
import { useAuth } from "../../contexts/AuthContext";

function formatReadAt(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("de-CH");
}

export default function ReadingSessionPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [users, setUsers] = useState([]);
  const [mangaId, setMangaId] = useState("");
  const [userId, setUserId] = useState("");
  const [chaptersRead, setChaptersRead] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const mangaOptions = useMemo(
    () =>
      Object.values(
        mangas.reduce((accumulator, manga) => {
          const existing = accumulator[manga.title];
          const volume = manga.volume ?? 0;

          if (!existing) {
            accumulator[manga.title] = {
              id: manga.id,
              title: manga.title,
              maxVolume: volume,
            };
            return accumulator;
          }

          if (volume > existing.maxVolume) {
            accumulator[manga.title] = {
              id: manga.id,
              title: manga.title,
              maxVolume: volume,
            };
          }

          return accumulator;
        }, {}),
      ).sort((left, right) => left.title.localeCompare(right.title, "de")),
    [mangas],
  );

  const load = async () => {
    setError("");

    try {
      const requests = [
        ReadingSessionApi.list(),
        api.get("/mangas").then((response) => response.data),
      ];

      if (isAdmin) {
        requests.push(api.get("/users").then((response) => response.data));
      }

      const [sessionData, mangaData, userData] = await Promise.all(requests);
      setSessions(sessionData);
      setMangas(mangaData);
      setUsers(userData ?? []);

      if (isAdmin) {
        setUserId((current) => current || String(userData?.[0]?.id ?? ""));
      } else {
        setUserId(String(user?.id ?? ""));
      }
    } catch (e) {
      setError(getApiErrorMessage(e, "Reading Sessions konnten nicht geladen werden"));
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin, user?.id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!mangaId) {
      setError("Manga ist Pflicht");
      return;
    }

    if (isAdmin && !userId) {
      setError("User ist Pflicht");
      return;
    }

    if (!chaptersRead || Number(chaptersRead) < 1) {
      setError("Chapter-Anzahl muss mindestens 1 sein");
      return;
    }

    const payload = {
      manga: { id: Number(mangaId) },
      chaptersRead: Number(chaptersRead),
      note: note.trim() ? note.trim() : null,
    };

    if (isAdmin) {
      payload.user = { id: Number(userId) };
    }

    try {
      setSaving(true);
      await ReadingSessionApi.create(payload);
      setMangaId("");
      setChaptersRead("");
      setNote("");
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Reading Session konnte nicht gespeichert werden"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Reading Session wirklich löschen?")) return;

    try {
      await ReadingSessionApi.remove(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Löschen fehlgeschlagen"));
    }
  };

  return (
    <div className="reading-session-stack">
      <div className="page-head">
        <div>
          <h2>Reading Sessions</h2>
          <p className="leaderboard-subtitle">
            Erfasse Leseereignisse pro Titel und aktualisiere dabei automatisch den Status.
          </p>
        </div>
      </div>

      {error ? <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div> : null}

      <section className="leaderboard-panel">
        <div className="leaderboard-panel-head">
          <h3>Neue Reading Session</h3>
          <span className="leaderboard-user-tag">{isAdmin ? "Admin-Modus" : "Eigene Session"}</span>
        </div>

        <form className="reading-session-form" onSubmit={onSubmit}>
          {isAdmin ? (
            <label>
              User*
              <select value={userId} onChange={(event) => setUserId(event.target.value)}>
                <option value="">-- wählen --</option>
                {users.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.username} (ID {entry.id})
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            Manga*
            <select value={mangaId} onChange={(event) => setMangaId(event.target.value)}>
              <option value="">-- wählen --</option>
              {mangaOptions.map((manga) => (
                <option key={manga.id} value={manga.id}>
                  {manga.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Gelesene Chapter*
            <input
              type="number"
              min="1"
              value={chaptersRead}
              onChange={(event) => setChaptersRead(event.target.value)}
            />
          </label>

          <label className="reading-session-form-note">
            Notiz
            <input value={note} onChange={(event) => setNote(event.target.value)} maxLength="255" />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Speichert..." : "Session speichern"}
          </button>
        </form>
      </section>

      <section className="leaderboard-panel">
        <div className="leaderboard-panel-head">
          <h3>Gespeicherte Sessions</h3>
          <span className="leaderboard-user-tag">{sessions.length} Einträge</span>
        </div>

        {sessions.length ? (
          <table className="leaderboard-table" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>ID</th>
                {isAdmin ? <th>User</th> : null}
                <th>Manga</th>
                <th>Chapter</th>
                <th>Gelesen am</th>
                <th>Resultierender Status</th>
                <th>Notiz</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.id}</td>
                  {isAdmin ? <td>{session.user?.username}</td> : null}
                  <td>{session.manga?.title}</td>
                  <td>{session.chaptersRead ?? "-"}</td>
                  <td>{formatReadAt(session.readAt)}</td>
                  <td>{session.resultingStatus}</td>
                  <td>{session.note ?? ""}</td>
                  <td>
                    <button type="button" onClick={() => onDelete(session.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Noch keine Reading Sessions vorhanden.</p>
        )}
      </section>
    </div>
  );
}
