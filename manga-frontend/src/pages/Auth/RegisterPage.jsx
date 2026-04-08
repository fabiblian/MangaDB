import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess("Registrierung erfolgreich. Du wirst zum Login weitergeleitet.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h2>Register</h2>
      {success ? <div style={{ color: "green", marginBottom: 12 }}>{success}</div> : null}
      {error ? <div style={{ color: "red", marginBottom: 12 }}>{error}</div> : null}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="register-password">Passwort</label>
          <input
            id="register-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Passwort bestätigen</label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registriere..." : "Registrieren"}
        </button>
      </form>
      <p>
        Bereits registriert? <Link to="/login">Zum Login</Link>
      </p>
    </section>
  );
}
