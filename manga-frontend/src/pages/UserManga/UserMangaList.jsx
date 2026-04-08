import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { UserMangaApi } from "../../api/userMangaApi";

export default function UserMangaList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setItems(await UserMangaApi.list());
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
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
      setError(getApiErrorMessage(e, "Löschen fehlgeschlagen"));
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
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.user?.username} (ID {item.user?.id})
              </td>
              <td>
                {item.manga?.title} #{item.manga?.volume} (ID {item.manga?.id})
              </td>
              <td>{item.status}</td>
              <td>{item.rating ?? ""}</td>
              <td>{item.note ?? ""}</td>
              <td>
                <Link to={`/user-manga/${item.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => onDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
