import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { UserApi } from "../../api/userApi";

export default function UserForm() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");

  const validate = () => {
    if (!username.trim()) return "Username ist Pflicht";
    if (!email.trim()) return "Email ist Pflicht";
    if (!password.trim()) return "Passwort ist Pflicht";
    if (password.length < 6) return "Passwort muss mindestens 6 Zeichen lang sein";
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
      await UserApi.create({ username, email, password, role });
      nav("/users");
    } catch (e2) {
      setError(getApiErrorMessage(e2, "Fehler beim Speichern"));
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
          Email*
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Passwort*
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <label>
          Rolle
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}
