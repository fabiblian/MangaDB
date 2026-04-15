import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import { UserMangaApi } from "../../api/userMangaApi";

const STATUS_VALUES = ["PLANNED", "READING", "COMPLETED", "DROPPED"];

export default function UserMangaForm() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [userId, setUserId] = useState("");
  const [mangaId, setMangaId] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const load = async () => {
      try {
        const requests = [api.get("/mangas").then((response) => response.data)];
        if (isAdmin) {
          requests.unshift(api.get("/users").then((response) => response.data));
        }

        const results = await Promise.all(requests);
        if (isAdmin) {
          setUsers(results[0]);
          setMangas(results[1]);
        } else {
          setUsers([]);
          setMangas(results[0]);
          setUserId(String(user?.id ?? ""));
        }
      } catch (e) {
        setError(getApiErrorMessage(e, "Fehler beim Laden von Users/Mangas"));
      }
    };
    load();
  }, [isAdmin, user?.id]);

  const validate = () => {
    if (isAdmin && !userId) return "User ist Pflicht";
    if (!mangaId) return "Manga ist Pflicht";
    if (!status) return "Status ist Pflicht";
    if (!STATUS_VALUES.includes(status)) return "Ungültiger Status";
    if (rating !== "") {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
        return "Rating muss zwischen 0 und 10 sein";
      }
    }
    if (note.length > 255) return "Note max 255 Zeichen";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const payload = {
      manga: { id: Number(mangaId) },
      status,
      rating: rating === "" ? null : Number(rating),
      note: note === "" ? null : note,
    };

    if (isAdmin) {
      payload.user = { id: Number(userId) };
    }

    try {
      await UserMangaApi.create(payload);
      nav("/user-manga");
    } catch (e2) {
      setError(getApiErrorMessage(e2, "Fehler beim Speichern"));
    }
  };

  return (
    <div>
      <h2>Status setzen</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        {isAdmin ? (
          <label>
            User*
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
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
          <select value={mangaId} onChange={(e) => setMangaId(e.target.value)}>
            <option value="">-- wählen --</option>
            {mangas.map((manga) => (
              <option key={manga.id} value={manga.id}>
                {manga.title} #{manga.volume} (ID {manga.id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Status*
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- wählen --</option>
            {STATUS_VALUES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rating (0-10)
          <input type="number" value={rating} min="0" max="10" onChange={(e) => setRating(e.target.value)} />
        </label>

        <label>
          Note (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
