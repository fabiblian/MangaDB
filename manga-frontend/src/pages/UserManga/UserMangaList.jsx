import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import { UserMangaApi } from "../../api/userMangaApi";

export default function UserMangaList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";
  const showUserColumn = isAdmin;
  const showActionColumn = items.length > 0;

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
            {showUserColumn ? <th>User</th> : null}
            <th>Manga</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Note</th>
            {showActionColumn ? <th>Aktion</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              {showUserColumn ? (
                <td>
                  {item.user?.username} (ID {item.user?.id})
                </td>
              ) : null}
              <td>
                {item.manga?.title} #{item.manga?.volume} (ID {item.manga?.id})
              </td>
              <td>{item.status}</td>
              <td>{item.rating ?? ""}</td>
              <td>{item.note ?? ""}</td>
              {showActionColumn ? (
                <td>
                  <Link to={`/user-manga/${item.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => onDelete(item.id)}>Delete</button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
