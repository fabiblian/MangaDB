import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserMangaApi } from "../../api/userMangaApi";

export default function UserMangaList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setItems(await UserMangaApi.list());
    } catch (e) {
      setError(e.response?.data || "Fehler beim Laden");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Status-Eintrag wirklich löschen?")) return;
    try {
      await UserMangaApi.remove(id);
      await load();
    } catch (e) {
      setError(e.response?.data || "Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>User-Manga Status</h2>
        <div className="page-actions">
          <Link className="action-link" to="/user-manga/new">
            Status Neu
          </Link>
        </div>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Manga</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Note</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>
                {x.user?.username} (ID {x.user?.id})
              </td>
              <td>
                {x.manga?.title} #{x.manga?.volume} (ID {x.manga?.id})
              </td>
              <td>{x.status}</td>
              <td>{x.rating ?? ""}</td>
              <td>{x.note ?? ""}</td>
              <td>
                <Link to={`/user-manga/${x.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => onDelete(x.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 12 }}>
        Tipp: Wenn du einen Manga/User nicht löschen kannst wegen FK, lösche zuerst die passenden Status-Einträge
        hier.
      </p>
    </div>
  );
}
