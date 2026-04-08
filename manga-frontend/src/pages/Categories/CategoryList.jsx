import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { CategoryApi } from "../../api/categoryApi";
import { useAuth } from "../../contexts/AuthContext";

export default function CategoryList() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";

  const load = async () => {
    setError("");
    try {
      setCategories(await CategoryApi.list());
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Kategorie wirklich loeschen?")) return;
    try {
      await CategoryApi.remove(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Loeschen fehlgeschlagen"));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>Kategorien</h2>
        <div className="page-actions">
          {isAdmin ? (
            <Link className="action-link" to="/categories/new">
              Kategorie Neu
            </Link>
          ) : null}
        </div>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{isAdmin ? <button onClick={() => onDelete(category.id)}>Delete</button> : <span>Nur Lesen</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
