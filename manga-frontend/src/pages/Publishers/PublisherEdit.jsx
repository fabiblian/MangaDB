import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublisherApi } from "../../api/publisherApi";

function getErrorMessage(e, fallback) {
  const data = e?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

export default function PublisherEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const p = await PublisherApi.get(id);
        setName(p.name || "");
      } catch (e) {
        setError(getErrorMessage(e, "Fehler beim Laden"));
      }
    };
    load();
  }, [id]);

  const validate = () => {
    if (!name.trim()) return "Name ist Pflicht";
    if (name.length > 100) return "Name max 100 Zeichen";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await PublisherApi.update(id, { name });
      nav("/publishers");
    } catch (e2) {
      setError(getErrorMessage(e2, "Fehler beim Speichern"));
    }
  };

  return (
    <div>
      <h2>Verlag bearbeiten (ID {id})</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          Name*
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
