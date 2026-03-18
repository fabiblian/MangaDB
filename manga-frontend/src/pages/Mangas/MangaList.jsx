import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MangaApi } from "../../api/mangaApi";
import { buildGroupedMangas } from "./mangaUtils";

function getErrorMessage(e, fallback) {
  const data = e?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setMangas(await MangaApi.list());
    } catch (e) {
      setError(getErrorMessage(e, "Fehler beim Laden"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Manga wirklich loeschen?")) return;

    try {
      await MangaApi.remove(id);
      await load();
    } catch (e) {
      setError(getErrorMessage(e, "Loeschen fehlgeschlagen (evtl. noch UserManga-Referenzen)"));
    }
  };

  const groupedMangas = buildGroupedMangas(mangas);

  return (
    <div>
      <div className="page-head">
        <h2>Mangas</h2>
        <div className="page-actions">
          <Link className="action-link" to="/mangas/new">
            Manga Neu
          </Link>
        </div>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Max Band</th>
            <th>Kategorie</th>
            <th>Verlag</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {groupedMangas.map((g) => (
            <tr key={g.key}>
              <td>{g.representative.id}</td>
              <td>{g.title}</td>
              <td>{g.maxVolume}</td>
              <td>{g.representative.category?.name}</td>
              <td>{g.representative.publisher?.name}</td>
              <td>
                <Link to={`/mangas/${g.representative.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => onDelete(g.representative.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
