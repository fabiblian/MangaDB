import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const trimmedUsername = form.usernameOrEmail.trim();
    const trimmedpassword = form.password.trim();



    if (trimmedUsername.length < 3 || trimmedUsername == null) {
      setError("Username ist zu kurz oder nicht vorhanden");
      alert("Bitte ein gültiger Username eingeben");
      return;
    }
    setIsLoading(true);


    if (trimmedpassword.length < 6 || trimmedpassword == null) {
      setError("Password ist zu kurz");
      alert("Bitte ein gültiges Password eingeben");
      return;

    }



    setIsLoading(true);









    try {
      await login(form.usernameOrEmail, form.password);
      navigate("/mangas");

    } catch (err) {
      setError(err.message || "Login fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h2>Login</h2>
      {error ? <div style={{ color: "red", marginBottom: 12 }}>{error}</div> : null}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usernameOrEmail">Username/E-Mail*</label>
          <input
            id="usernameOrEmail"
            type="text"
            value={form.usernameOrEmail}
            onChange={(event) => setForm((current) => ({ ...current, usernameOrEmail: event.target.value }))}
            placeholder="admin oder admin@manga.local"
            required="elias.kaiser@gmx.ch"
          />
        </div>
        <div>
          <label htmlFor="password">Passwort*</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Bitte ein gültiges Password eingeben"
            required="momo9010"
          />
        </div>
        <button className="login" type="submit" disabled={isLoading}>
          {isLoading ? "Logge ein..." : "Einloggen"}
        </button>


        <button type="submit" >Zu den Mangas <Link to="/mangas"></Link>




        </button>
      </form>
      <p>
        Noch kein Account? <Link to="/register">Jetzt registrieren</Link>
      </p>
      <div style={{ marginTop: 16 }}>
        <strong>Test-Accounts:</strong>
        <div>Admin: admin / admin123</div>
        <div>User: hans / welcome123</div>
      </div>
    </section>
  );
}
