import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { UserMangaApi } from "../../api/userMangaApi";

const STATUS_VALUES = ["PLANNED", "READING", "COMPLETED", "DROPPED"];

export default function UserMangaForm() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [mangas, setMangas] = useState([]);

  const [userId, setUserId] = useState("");
  const [mangaId, setMangaId] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [u, m] = await Promise.all([api.get("/users").then((r) => r.data), api.get("/mangas").then((r) => r.data)]);
        setUsers(u);
        setMangas(m);
      } catch (e) {
        setError(e.response?.data || "Fehler beim Laden von Users/Mangas");
      }
    };
    load();
  }, []);

  const validate = () => {
    if (!userId) return "User ist Pflicht";
    if (!mangaId) return "Manga ist Pflicht";
    if (!status) return "Status ist Pflicht";
    if (!STATUS_VALUES.includes(status)) return "Ungültiger Status";
    if (rating !== "") {
      const r = Number(rating);
      if (Number.isNaN(r) || r < 0 || r > 10) return "Rating muss zwischen 0 und 10 sein";
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
      user: { id: Number(userId) },
      manga: { id: Number(mangaId) },
      status,
      rating: rating === "" ? null : Number(rating),
      note: note === "" ? null : note,
    };

    try {
      await UserMangaApi.create(payload);
      nav("/user-manga");
    } catch (e2) {
      setError(e2.response?.data || "Fehler beim Speichern (evtl. Duplikat user+manga)");
    }
  };

  return (
    <div>
      <h2>Status setzen</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          User*
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">-- wählen --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} (ID {u.id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Manga*
          <select value={mangaId} onChange={(e) => setMangaId(e.target.value)}>
            <option value="">-- wählen --</option>
            {mangas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} #{m.volume} (ID {m.id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Status*
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- wählen --</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {s}
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
