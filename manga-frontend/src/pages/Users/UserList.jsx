import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserApi } from "../../api/userApi";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setUsers(await UserApi.list());
    } catch (e) {
      setError(e.response?.data || "Fehler beim Laden");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("User wirklich löschen?")) return;
    try {
      await UserApi.remove(id);
      await load();
    } catch (e) {
      setError(e.response?.data || "Löschen fehlgeschlagen (evtl. noch UserManga-Referenzen)");
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>Users</h2>
        <div className="page-actions">
          <Link className="action-link" to="/users/new">
            User Neu
          </Link>
        </div>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <Link to={`/users/${u.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => onDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
