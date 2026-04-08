import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { PublisherApi } from "../../api/publisherApi";
import { useAuth } from "../../contexts/AuthContext";

export default function PublisherList() {
  const { user } = useAuth();
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";

  const load = async () => {
    setError("");
    try {
      setPublishers(await PublisherApi.list());
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
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
      setError(getApiErrorMessage(e, "Loeschen fehlgeschlagen"));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>Verlage</h2>
        <div className="page-actions">
          {isAdmin ? (
            <Link className="action-link" to="/publishers/new">
              Verlag Neu
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
          {publishers.map((publisher) => (
            <tr key={publisher.id}>
              <td>{publisher.id}</td>
              <td>{publisher.name}</td>
              <td>
                {isAdmin ? (
                  <>
                    <Link to={`/publishers/${publisher.id}/edit`}>Edit</Link>{" "}
                    <button onClick={() => onDelete(publisher.id)}>Delete</button>
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
