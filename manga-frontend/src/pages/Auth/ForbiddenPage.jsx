import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <section style={{ textAlign: "center", padding: 32 }}>
      <h1>403</h1>
      <p>Du hast keine Berechtigung für diese Seite.</p>
      <Link to="/mangas">Zurück zur Manga-Liste</Link>
    </section>
  );
}
