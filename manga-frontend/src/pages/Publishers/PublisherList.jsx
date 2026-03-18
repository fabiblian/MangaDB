import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublisherApi } from "../../api/publisherApi";

function getErrorMessage(e, fallback) {
  const data = e?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

export default function PublisherList() {
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setPublishers(await PublisherApi.list());
    } catch (e) {
      setError(getErrorMessage(e, "Fehler beim Laden"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Verlag wirklich loeschen?")) return;
    try {
      await PublisherApi.remove(id);
      await load();
    } catch (e) {
      setError(getErrorMessage(e, "Loeschen fehlgeschlagen (evtl. noch Manga-Referenzen)"));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>Verlage</h2>
        <div className="page-actions">
          <Link className="action-link" to="/publishers/new">
            Verlag Neu
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
          {publishers.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>
                <Link to={`/publishers/${p.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => onDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
