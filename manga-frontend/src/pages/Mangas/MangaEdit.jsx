import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MangaApi } from "../../api/mangaApi";
import { api } from "../../api/client";
import { validateMangaForm } from "./mangaUtils";

export default function MangaEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [publisherId, setPublisherId] = useState("");

  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [m, cats, pubs] = await Promise.all([
          MangaApi.get(id),
          api.get("/categories").then((r) => r.data),
          api.get("/publishers").then((r) => r.data),
        ]);

        setCategories(cats);
        setPublishers(pubs);

        setTitle(m.title || "");
        setVolume(m.volume || 1);
        setCategoryId(String(m.category?.id ?? ""));
        setPublisherId(String(m.publisher?.id ?? ""));
      } catch (e) {
        setError(e.response?.data || "Fehler beim Laden");
      }
    };

    load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validateMangaForm({ title, volume, categoryId, publisherId });
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await MangaApi.update(id, {
        title,
        volume: Number(volume),
        category: { id: Number(categoryId) },
        publisher: { id: Number(publisherId) },
      });
      nav("/mangas");
    } catch (e2) {
      setError(e2.response?.data || "Fehler beim Speichern");
    }
  };

  return (
    <div>
      <h2>Manga bearbeiten (ID {id})</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          Titel
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Bandnummer
          <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </label>

        <label>
          Kategorie
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- waehlen --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Verlag
          <select value={publisherId} onChange={(e) => setPublisherId(e.target.value)}>
            <option value="">-- waehlen --</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
