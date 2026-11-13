import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeaderSearch, type SearchMode } from "../hooks/useHeaderSearch";
import type {
  IngredientSearchResult,
  IngredientSummary,
  PerfumeSearchResult,
} from "../types";

type SearchResult = PerfumeSearchResult | IngredientSearchResult;

// Adjust these two if your routes are named differently.
const DETAIL_PATH: Record<SearchMode, (id: number) => string> = {
  perfume: (id) => `/perfumes/${id}`,
  ingredient: (id) => `/ingredient/${id}`,
};

const MIN_CHARS = 2;

export default function HeaderSearchBar() {
  const { mode, setMode, query, setQuery, results, loading, error, clear } =
    useHeaderSearch();

  // UI state (dropdown open/closed, keyboard-highlighted item): kept local
  // to the component because it isn't about the search itself, and the
  // hook deliberately doesn't expose it.
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Opens/closes the dropdown based on what the hook returns (runSearch
  // used to do it after the fetch; now runSearch lives inside the hook,
  // so we derive it here from results/loading/error).
  useEffect(() => {
    setActiveIndex(-1);
    if (query.trim().length < MIN_CHARS) {
      setIsOpen(false);
      return;
    }
    setIsOpen(loading || results.length > 0 || !!error);
  }, [results, loading, error, query]);

  // Closes the dropdown on clicks outside the component.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectResult(item: SearchResult) {
    setIsOpen(false);
    clear();
    navigate(DETAIL_PATH[mode](item.id));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        selectResult(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
    // setMode here is already the hook's changeMode: it resets the results
    // and the hook's internal useEffect re-runs the search for the new mode
    // on its own, so nothing needs to be triggered manually.
    setMode(e.target.value as SearchMode);
  }

  return (
    <div
      ref={containerRef}
      className="position-relative w-100"
      style={{ maxWidth: "32rem" }}
    >
      <div className="input-group">
        <select
          value={mode}
          onChange={handleModeChange}
          aria-label="Search by"
          className="form-select flex-grow-0 w-auto"
        >
          <option value="perfume">Perfume</option>
          <option value="ingredient">Ingredient</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={
            mode === "perfume"
              ? "Search a perfume..."
              : "Search an ingredient..."
          }
          className="form-control"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {loading && (
          <span className="input-group-text" aria-hidden="true">
            <span className="spinner-border spinner-border-sm" role="status" />
          </span>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="dropdown-menu show w-100 mt-1 shadow-sm"
          style={{ maxHeight: "20rem", overflowY: "auto" }}
        >
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => selectResult(item)}
                className={`dropdown-item d-flex align-items-center gap-2 ${
                  i === activeIndex ? "active" : ""
                }`}
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

      {isOpen && !loading && error && (
        <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-danger">
          {error}
        </div>
      )}

      {isOpen &&
        !loading &&
        !error &&
        results.length === 0 &&
        query.trim().length >= MIN_CHARS && (
          <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-muted">
            No results for "{query}"
          </div>
        )}
    </div>
  );
}
