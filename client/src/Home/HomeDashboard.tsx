import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import HeaderSearchBar from "../Header/HeaderSearchBar";
import { useHome } from "../hooks/useHome";
import { colorForAccord } from "../utils/accordColor";

const ENTRY_POINTS = [
  {
    to: "/perfumes",
    eyebrow: "Browse",
    title: "Perfume houses A–Z",
    text: "Every house with its full catalogue, one letter at a time.",
    cta: "Open the index",
  },
  {
    to: "/ingredient",
    eyebrow: "Learn",
    title: "Raw materials glossary",
    text: "Botanical names, volatility, and how each material evolves on skin.",
    cta: "Open the glossary",
  },
  {
    to: "/advanced-search",
    eyebrow: "Find",
    title: "Advanced search",
    text: "Combine notes, accords, house and release year.",
    cta: "Start filtering",
  },
];

function formatCount(n: number | undefined) {
  return n === undefined ? "—" : n.toLocaleString("en-US");
}

// Thin line-art sprig, purely decorative (echoes botanical illustrations).
function Sprig({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M60 215 C 58 160, 66 110, 62 20" />
      <path d="M61 170 C 40 160, 22 150, 14 128 C 34 130, 52 146, 61 170 Z" />
      <path d="M62 140 C 82 132, 98 118, 106 96 C 86 98, 70 116, 62 140 Z" />
      <path d="M62 105 C 44 96, 32 82, 28 62 C 46 68, 58 84, 62 105 Z" />
      <path d="M62 70 C 76 62, 86 48, 88 32 C 74 38, 64 52, 62 70 Z" />
      <circle cx="62" cy="16" r="5" />
    </svg>
  );
}

export default function HomeDashboard() {
  const { stats, accords, featured } = useHome();
  const heroPerfume = featured[0];

  const statItems = [
    { value: stats?.perfumes, label: "perfumes" },
    { value: stats?.brands, label: "perfume houses" },
    { value: stats?.ingredients, label: "raw materials & notes" },
    { value: stats?.accords, label: "accords" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="container hero">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <span className="eyebrow">A perfume &amp; raw-material atlas</span>
            <h1 className="hero-title">
              The art of scent, read <em>note by note</em>
            </h1>
            <p className="hero-lead">
              Houses, olfactory pyramids, ranked accords and the raw materials
              behind them — merged from Première Peau, Fragrantica and Parfumo.
            </p>
            <div className="mt-4">
              <HeaderSearchBar large />
            </div>
            <Link to="/advanced-search" className="link-cta mt-2">
              Filter by notes, accords and year <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="col-lg-5 d-none d-lg-block position-relative">
            <Sprig className="position-absolute text-secondary opacity-50 hero-sprig" />
            {heroPerfume?.imageUrl ? (
              <Link
                to={`/perfumes/${heroPerfume.id}`}
                className="photo-plate hero-art"
                aria-label={`${heroPerfume.title} by ${heroPerfume.brandName}`}
              >
                <img src={heroPerfume.imageUrl} alt="" />
              </Link>
            ) : (
              <div className="photo-plate hero-art" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="stats" aria-label="The database at a glance">
          <div className="container">
            <div className="row row-cols-2 row-cols-md-4">
              {statItems.map((s) => (
                <div className="col py-4" key={s.label}>
                  <div className="stat-value">{formatCount(s.value)}</div>
                  <div className="eyebrow mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore by accord */}
      {accords.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2 className="section-title">Explore by accord</h2>
            <Link to="/advanced-search" className="link-cta">
              All accords <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
            {accords.map((a) => (
              <div className="col" key={a.id}>
                <Link
                  to={`/advanced-search?accord=${a.id}`}
                  className="accord-tile h-100"
                  style={
                    { "--accord-color": colorForAccord(a.name) } as CSSProperties
                  }
                >
                  <span className="name">{a.name.toLowerCase()}</span>
                  <span className="small text-secondary">{a.hint}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Classics */}
      {featured.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2 className="section-title">Classics to start with</h2>
            <Link to="/perfumes" className="link-cta">
              All perfume houses <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="row row-cols-2 row-cols-lg-4 g-4">
            {featured.map((p) => (
              <div className="col" key={p.id}>
                <Link to={`/perfumes/${p.id}`} className="product-card">
                  <div className="photo-plate">
                    {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" />}
                  </div>
                  <div className="title">{p.title}</div>
                  <div className="meta">{p.brandName}</div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Entry points */}
      <section className="container section">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {ENTRY_POINTS.map((e) => (
            <div className="col" key={e.to}>
              <Link to={e.to} className="entry-card">
                <span className="eyebrow">{e.eyebrow}</span>
                <span className="title">{e.title}</span>
                <span className="text-secondary">{e.text}</span>
                <span className="go">
                  {e.cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
