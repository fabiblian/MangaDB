import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryApi } from "../../api/categoryApi";

function getErrorMessage(e, fallback) {
  const data = e?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setCategories(await CategoryApi.list());
    } catch (e) {
      setError(getErrorMessage(e, "Fehler beim Laden"));
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
      setError(getErrorMessage(e, "Loeschen fehlgeschlagen (evtl. noch Manga-Referenzen)"));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>Kategorien</h2>
        <div className="page-actions">
          <Link className="action-link" to="/categories/new">
            Kategorie Neu
          </Link>
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
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => onDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
