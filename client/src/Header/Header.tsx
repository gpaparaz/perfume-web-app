import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import HeaderSearchBar from "./HeaderSearchBar";

const NAV_ITEMS = [
  { to: "/perfumes", label: "Perfumes" },
  { to: "/ingredient", label: "Ingredients" },
  { to: "/advanced-search", label: "Advanced search" },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu and the search panel whenever the route changes
  // (e.g. after picking a search result). Tracking the last path in state
  // lets us do it during render instead of in an effect.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link to="/" className="wordmark me-lg-5">
            Perfume Database
          </Link>

          <div className="d-flex align-items-center gap-1 order-lg-last">
            <button
              type="button"
              className="icon-btn"
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-controls="header-search"
              onClick={() => setSearchOpen((o) => !o)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
            <button
              type="button"
              className="navbar-toggler border-0"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div
            id="site-nav"
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          >
            <ul className="navbar-nav site-nav mx-lg-auto gap-lg-4">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink to={item.to} className="nav-link">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div id="header-search" className="header-search">
          <div className="container d-flex justify-content-center">
            <HeaderSearchBar autoFocus />
          </div>
        </div>
      )}
    </header>
  );
}
