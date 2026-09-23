import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvancedSearch } from "../hooks/useAdvancedSearch";
import { type SearchMode } from "../hooks/useHeaderSearch";
import type {
  IngredientSearchResult,
  IngredientSummary,
  PerfumeSearchResult,
} from "../types";

type SearchResult = PerfumeSearchResult | IngredientSearchResult;

const DETAIL_PATH: Record<SearchMode, (id: number) => string> = {
  perfume: (id) => `/perfumes/${id}`,
  ingredient: (id) => `/ingredient/${id}`,
};

const MIN_CHARS = 2;

export default function AdvancedSearch() {
  const { mode, setMode, query, setQuery, results, loading, error, clear } =
    useAdvancedSearch();
  const navigate = useNavigate();

  function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
    // setMode qui è già changeMode dell'hook: resetta i risultati e la
    // useEffect interna rilancia da sola la ricerca sulla nuova modalità,
    // non serve richiamare nulla manualmente.
    setMode(e.target.value as SearchMode);
  }

  return (
    <div className="container my-5">
      <span>Search by name</span>
      <div className="position-relative w-100" style={{ maxWidth: "32rem" }}>
        <div className="input-group">
          <select
            value={mode}
            onChange={handleModeChange}
            aria-label="Cerca per"
            className="form-select flex-grow-0 w-auto"
          >
            <option value="perfume">Profumo</option>
            <option value="ingredient">Ingrediente</option>
          </select>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0}
            placeholder={
              mode === "perfume"
                ? "Cerca un profumo..."
                : "Cerca un ingrediente..."
            }
            className="form-control"
            aria-autocomplete="list"
          />

          {loading && (
            <span className="input-group-text" aria-hidden="true">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
            </span>
          )}
        </div>

        {results.length > 0 && (
          <ul
            role="listbox"
            className="dropdown-menu show w-100 mt-1 shadow-sm"
            style={{ maxHeight: "20rem", overflowY: "auto" }}
          >
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  onClick={() => console.log("clicked")}
                  className={`dropdown-item d-flex align-items-center gap-2 `}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="rounded flex-shrink-0"
                      style={{
                        width: "2rem",
                        height: "2rem",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  )}
                  <span className="text-truncate">
                    {mode === "perfume" ? (
                      <>
                        <div className="text-truncate">
                          {(item as PerfumeSearchResult).title}
                        </div>
                        <div className="text-truncate small text-muted">
                          {(item as PerfumeSearchResult).brandName}
                        </div>
                      </>
                    ) : (
                      <div className="text-truncate">
                        {(item as IngredientSummary).name}
                      </div>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && error && (
          <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-danger">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          results.length === 0 &&
          query.trim().length >= MIN_CHARS && (
            <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-muted">
              Nessun risultato per "{query}"
            </div>
          )}
      </div>
    </div>
  );
}
