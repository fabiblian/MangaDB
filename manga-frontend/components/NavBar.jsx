import { NavLink } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";

const publicLinks = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

const userLinks = [
  { to: "/mangas", label: "Mangas" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/user-manga", label: "Status" },
  { to: "/reading-sessions", label: "Sessions" },
  { to: "/publishers", label: "Verlage" },
  { to: "/categories", label: "Kategorien" },
];

const adminLinks = [{ to: "/users", label: "Users" }];

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const links = isAuthenticated
    ? [...userLinks, ...(user?.role === "ADMIN" ? adminLinks : [])]
    : publicLinks;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">Manga DB</div>
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
              <span className="nav-link">
                {user?.username} ({user?.role})
              </span>
              <button type="button" className="nav-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
