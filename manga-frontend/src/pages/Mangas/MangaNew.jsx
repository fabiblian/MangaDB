import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getApiErrorMessage } from "../../api/client";
import { MangaApi } from "../../api/mangaApi";
import { validateMangaForm } from "./mangaUtils";

export default function MangaNew() {
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
        const cats = (await api.get("/categories")).data;
        const pubs = (await api.get("/publishers")).data;
        setCategories(cats);
        setPublishers(pubs);
      } catch (e) {
        setError(getApiErrorMessage(e, "Fehler beim Laden"));
      }
    };
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validateMangaForm({ title, volume, categoryId, publisherId });
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await MangaApi.create({
        title,
        volume: Number(volume),
        category: { id: Number(categoryId) },
        publisher: { id: Number(publisherId) },
      });
      nav("/mangas");
    } catch (e2) {
      setError(getApiErrorMessage(e2, "Fehler beim Speichern"));
    }
  };

  return (
    <div>
      <h2>Neuer Manga</h2>
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
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Verlag
          <select value={publisherId} onChange={(e) => setPublisherId(e.target.value)}>
            <option value="">-- waehlen --</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
