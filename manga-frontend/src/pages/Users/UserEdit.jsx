import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserApi } from "../../api/userApi";

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const u = await UserApi.get(id);
        setUsername(u.username || "");
        setEmail(u.email || "");
      } catch (e) {
        setError(e.response?.data || "Fehler beim Laden");
      }
    };

    load();
  }, [id]);

  const validate = () => {
    if (!username.trim()) return "Username ist Pflict";
    if (username.length > 50) return "Username max 50 Zeichen";
    if (email && email.length > 50) return "Email max 50 Zeichen";
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
      await UserApi.update(id, { username, email: email || null });
      nav("/users");
    } catch (e2) {
      setError(e2.response?.data || "Fehler beim Speichern");
    }
  };

  return (
    <div>
      <h2>User bearbeiten (ID {id})</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          Username*
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Email (optional)
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
