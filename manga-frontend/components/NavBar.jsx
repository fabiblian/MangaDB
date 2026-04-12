import { NavLink } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";

const publicLinks = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

const userLinks = [
  { to: "/mangas", label: "Mangas" },
  { to: "/user-manga", label: "Status" },
  { to: "/publishers", label: "Verlage" },
  { to: "/categories", label: "Kategorien" },
  { to: "/leaderboard", label: "Manga Leaderboard" },
  { to: "/mangalibary", label: "Mangalibarysession" },


];

const adminLinks = [{ to: "/users", label: "Users" }];

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  // Die Links werden basierend auf dem Auth-Status gefiltert
  const links = isAuthenticated
    ? [...userLinks, ...(user?.role === "ADMIN" ? adminLinks : [])]
    : publicLinks;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="manga">Manga DB</div>

        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-links" style={{ marginLeft: "auto" }}>
          {isAuthenticated ? (
            <>
              {/* Einheitlicher NavLink für die Stats */}
              <NavLink
                to="/stats"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Meine Stats
              </NavLink>
              <NavLink to="/user-stats">Userstats</NavLink>

              <NavLink to="/mangas/new">Manga hinzufügen</NavLink>

              <NavLink to="/users/new">User hinzufügen</NavLink>



              <span className="nav-link user-info">
                {user?.username} ({user?.role})
              </span>

              <button type="button" className="nav-link logout-btn" onClick={logout}>
                Logout
              </button>

            </>
          ) : null}
        </div>
      </div>




      <nav className="nav-container">
        {/* Andere Nav-Links... */}

        {user && (
          <div className="nav-auth-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

            {/* Anzeige wer eingeloggt ist */}
            <span className="user-info" style={{ fontWeight: 'bold' }}>
              Eingeloggt als: {user.username}
            </span>

            {/* Der rote Logout-Button */}
            <button
              type="button"
              className="nav-link logout-btn"
              onClick={logout}
              style={{
                backgroundColor: '#ff4d4d',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>

          </div>
        )}
      </nav>

    </header>
  );
}