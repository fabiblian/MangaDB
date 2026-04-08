import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { MangaApi } from "../../api/mangaApi";
import { useAuth } from "../../contexts/AuthContext";
import { buildGroupedMangas } from "./mangaUtils";

export default function MangaList() {
  const { user } = useAuth();
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";

  const load = async () => {
    setError("");
    try {
      setMangas(await MangaApi.list());
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
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
      setError(getApiErrorMessage(e, "Loeschen fehlgeschlagen"));
    }
  };

  const groupedMangas = buildGroupedMangas(mangas);

  return (
    <div>
      <div className="page-head">
        <h2>Mangas</h2>
        <div className="page-actions">
          {isAdmin ? (
            <Link className="action-link" to="/mangas/new">
              Manga Neu
            </Link>
          ) : null}
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
          {groupedMangas.map((grouped) => (
            <tr key={grouped.key}>
              <td>{grouped.representative.id}</td>
              <td>{grouped.title}</td>
              <td>{grouped.maxVolume}</td>
              <td>{grouped.representative.category?.name}</td>
              <td>{grouped.representative.publisher?.name}</td>
              <td>
                {isAdmin ? (
                  <>
                    <Link to={`/mangas/${grouped.representative.id}/edit`}>Edit</Link>{" "}
                    <button onClick={() => onDelete(grouped.representative.id)}>Delete</button>
                  </>
                ) : (
                  <span>Nur Lesen</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
