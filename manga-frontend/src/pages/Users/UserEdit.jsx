import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { UserApi } from "../../api/userApi";

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const user = await UserApi.get(id);
        setUsername(user.username || "");
        setEmail(user.email || "");
        setRole(user.role || "USER");
      } catch (e) {
        setError(getApiErrorMessage(e, "Fehler beim Laden"));
      }
    };

    load();
  }, [id]);

  const validate = () => {
    if (!username.trim()) return "Username ist Pflicht";
    if (!email.trim()) return "Email ist Pflicht";
    if (password && password.length < 6) return "Passwort muss mindestens 6 Zeichen lang sein";
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
      await UserApi.update(id, { username, email, password, role });
      nav("/users");
    } catch (e2) {
      setError(getApiErrorMessage(e2, "Fehler beim Speichern"));
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
          Email*
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Neues Passwort (optional)
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
