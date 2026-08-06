import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Adjust these two if your routes are named differently.
const DETAIL_PATH = {
  perfume: (id) => `/profumi/${id}`,
  ingredient: (id) => `/ingredienti/${id}`,
};

const SEARCH_ENDPOINT = {
  perfume: "/api/search/perfumes",
  ingredient: "/api/search/ingredients",
};

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

export default function HeaderSearchBar() {
  const [mode, setMode] = useState("perfume");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const runSearch = useCallback((searchMode, searchQuery) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    fetch(
      `${SEARCH_ENDPOINT[searchMode]}?q=${encodeURIComponent(
        searchQuery
      )}&limit=8`,
      {
        signal: controller.signal,
      }
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("search failed"))
      )
      .then((data) => {
        setResults(data);
        setIsOpen(true);
        setActiveIndex(-1);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setResults([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < MIN_CHARS) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(
      () => runSearch(mode, query.trim()),
      DEBOUNCE_MS
    );
    return () => clearTimeout(debounceRef.current);
  }, [query, mode, runSearch]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectResult(item) {
    const id = item.id;
    setIsOpen(false);
    setQuery("");
    setResults([]);
    navigate(DETAIL_PATH[mode](id));
  }

  function handleKeyDown(e) {
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

  function handleModeChange(e) {
    const newMode = e.target.value;
    setMode(newMode);
    if (query.trim().length >= MIN_CHARS) runSearch(newMode, query.trim());
  }

  return (
    <div ref={containerRef} className="d-flex w-full max-w-md">
      <div className="d-flex flex-row ">
        <select
          value={mode}
          onChange={handleModeChange}
          aria-label="Cerca per"
          className="shrink-0"
        >
          <option value="perfume">Profumo</option>
          <option value="ingredient">Ingrediente</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={
            mode === "perfume"
              ? "Cerca un profumo..."
              : "Cerca un ingrediente..."
          }
          className="flex-1 px-3 py-2"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {loading && <span className="flex items-center px-3">...</span>}
      </div>

      {isOpen && results.length > 0 && (
        <ul role="listbox">
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => selectResult(item)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
                i === activeIndex ? "bg-zinc-100 dark:bg-zinc-700" : ""
              }`}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded object-cover shrink-0"
                  loading="lazy"
                />
              )}
              <div className="min-w-0">
                {mode === "perfume" ? (
                  <>
                    <div className="truncate text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {item.brandName}
                    </div>
                  </>
                ) : (
                  <div className="truncate text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen &&
        !loading &&
        results.length === 0 &&
        query.trim().length >= MIN_CHARS && (
          <div>Nessun risultato per "{query}"</div>
        )}
    </div>
  );
}
