import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "../../api/userApi";

export default function UserForm() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!username.trim()) return "Username ist Pflicht";
    if (username.length > 50) return "Username max 50 Zeichen";
    if (email && email.length > 50) return "Email max 50 Zeichen";
    return "";
  };

  const onSubmit = async (e) => { ///  ?
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await UserApi.create({ username, email: email || null });
      nav("/users");
    } catch (e2) {
      setError(e2.response?.data || "Fehler beim Speichern");
    }
  };

  return (
    <div>
      <h2>User erstellen</h2>
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
