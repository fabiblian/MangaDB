import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserMangaApi } from "../../api/userMangaApi";

const STATUS_VALUES = ["PLANNED", "READING", "COMPLETED", "DROPPED"];

export default function UserMangaEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const items = await UserMangaApi.list();
        const x = items.find((i) => String(i.id) === String(id));
        if (!x) {
          setError("UserManga not found");
          return;
        }
        setStatus(x.status || "");
        setRating(x.rating ?? "");
        setNote(x.note ?? "");
      } catch (e) {
        setError(e.response?.data || "Fehler beim Laden");
      }
    };
    load();
  }, [id]);

  const validate = () => {
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

    try {
      await UserMangaApi.update(id, {
        status,
        rating: rating === "" ? null : Number(rating),
        note: note === "" ? null : note,
      });
      nav("/user-manga");
    } catch (e2) {
      setError(e2.response?.data || "Fehler beim Speichern");
    }
  };

  return (
    <div>
      <h2>Status bearbeiten (ID {id})</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
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
