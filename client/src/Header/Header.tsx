import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="w-100">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="#">
            Perfums database
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="navbar-brand">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/glossary" className="navbar-brand">
                  Glossary
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/fragrances" className="navbar-brand">
                  Fragrances
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
