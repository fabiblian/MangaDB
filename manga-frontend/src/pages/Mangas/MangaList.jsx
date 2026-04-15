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
  const [selectedKey, setSelectedKey] = useState("");
  const isAdmin = user?.role === "ADMIN";
  const showActionColumn = isAdmin;

  const load = async () => {
    setError("");
    try {
      const items = await MangaApi.list();
      setMangas(items);
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Manga wirklich löschen?")) return;

    try {
      await MangaApi.remove(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Löschen fehlgeschlagen"));
    }
  };

  const groupedMangas = buildGroupedMangas(mangas);
  const selectedManga =
    groupedMangas.find((grouped) => grouped.key === selectedKey) ?? groupedMangas[0] ?? null;

  useEffect(() => {
    if (!groupedMangas.length) {
      setSelectedKey("");
      return;
    }

    if (!selectedKey || !groupedMangas.some((grouped) => grouped.key === selectedKey)) {
      setSelectedKey(groupedMangas[0].key);
    }
  }, [groupedMangas, selectedKey]);

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

      <div className="manga-list-layout">
        <div className="manga-list-table-wrap">
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Titel</th>
                <th>Kategorie</th>
                <th>Verlag</th>
                {showActionColumn ? <th>Aktion</th> : null}
              </tr>
            </thead>
            <tbody>
              {groupedMangas.map((grouped) => {
                const isSelected = grouped.key === selectedManga?.key;

                return (
                  <tr
                    key={grouped.key}
                    className={isSelected ? "manga-row-selected" : ""}
                    onClick={() => setSelectedKey(grouped.key)}
                  >
                    <td>{grouped.representative.id}</td>
                    <td>
                      <button
                        type="button"
                        className="manga-title-button"
                        onClick={() => setSelectedKey(grouped.key)}
                      >
                        {grouped.title}
                      </button>
                    </td>
                    <td>{grouped.representative.category?.name}</td>
                    <td>{grouped.representative.publisher?.name}</td>
                    {showActionColumn ? (
                      <td>
                        {isAdmin ? (
                        <>
                          <Link to={`/mangas/${grouped.representative.id}/edit`}>Edit</Link>{" "}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDelete(grouped.representative.id);
                            }}
                          >
                            Delete
                          </button>
                        </>
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="manga-detail-card">
          {selectedManga ? (
            <>
              <p className="manga-detail-eyebrow">Ausgewähltes Cover</p>
              <h3>{selectedManga.title}</h3>
              <p>
                  {selectedManga.representative.category?.name}
              </p>
              <div className="manga-cover-frame">
                {selectedManga.representative.imageUrl ? (
                  <img
                    className="manga-cover-image"
                    src={selectedManga.representative.imageUrl}
                    alt={`Cover von ${selectedManga.title}`}
                  />
                ) : (
                  <div className="manga-cover-placeholder">Kein Cover hinterlegt</div>
                )}
              </div>
              <p className="manga-detail-meta">
                Verlag: {selectedManga.representative.publisher?.name}
              </p>
            </>
          ) : (
            <p>Keine Mangas vorhanden.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
