import { NavLink } from "react-router-dom";

const links = [
  { to: "/mangas", label: "Mangas" },
  { to: "/users", label: "Users" },
  { to: "/user-manga", label: "Status" },
  { to: "/publishers", label: "Verlage" },
  { to: "/categories", label: "Kategorien" },
];

export default function NavBar() {
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
      </div>
    </header>
  );
}
