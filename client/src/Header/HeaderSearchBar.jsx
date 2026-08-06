import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeaderSearch, type SearchMode } from "../hooks/useHeaderSearch";
import type { IngredientSummary, PartialPerfumes } from "../types";

type SearchResult = PartialPerfumes | IngredientSummary;

// Adjust these two if your routes are named differently.
const DETAIL_PATH: Record<SearchMode, (id: number) => string> = {
  perfume: (id) => `/perfumes/${id}`,
  ingredient: (id) => `/ingredients/${id}`,
};

const MIN_CHARS = 2;

export default function HeaderSearchBar() {
  const { mode, setMode, query, setQuery, results, loading, error, clear } =
    useHeaderSearch();

  // Stato di UI (dropdown aperto/chiuso, elemento evidenziato da tastiera):
  // resta locale al componente perché non riguarda la ricerca in sé, e
  // l'hook non lo espone di proposito.
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Apre/chiude il dropdown in base a cosa arriva dall'hook (prima lo
  // faceva runSearch al termine del fetch; ora runSearch è dentro l'hook,
  // quindi lo deduciamo qui osservando risultati/loading/errore).
  useEffect(() => {
    setActiveIndex(-1);
    if (query.trim().length < MIN_CHARS) {
      setIsOpen(false);
      return;
    }
    setIsOpen(loading || results.length > 0 || !!error);
  }, [results, loading, error, query]);

  // Chiude il dropdown al click fuori dal componente.
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
    // setMode qui è già changeMode dell'hook: resetta i risultati e la
    // useEffect interna rilancia da sola la ricerca sulla nuova modalità,
    // non serve richiamare nulla manualmente.
    setMode(e.target.value as SearchMode);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-stretch rounded-lg border border-zinc-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-zinc-400 dark:bg-zinc-800 dark:border-zinc-600">
        <select
          value={mode}
          onChange={handleModeChange}
          aria-label="Cerca per"
          className="shrink-0 border-r border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm px-2 text-zinc-700 dark:text-zinc-100 focus:outline-none"
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
            mode === "perfume" ? "Cerca un profumo..." : "Cerca un ingrediente..."
          }
          className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none dark:text-zinc-100"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {loading && (
          <span className="flex items-center px-3 text-xs text-zinc-400" aria-hidden="true">
            ...
          </span>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:bg-zinc-800 dark:border-zinc-600"
        >
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
                      {(item as PartialPerfumes).title}
                    </div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {(item as PartialPerfumes).brandName}
                    </div>
                  </>
                ) : (
                  <div className="truncate text-zinc-900 dark:text-zinc-100">
                    {(item as IngredientSummary).name}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !loading && error && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg px-3 py-2 text-sm text-red-500 dark:bg-zinc-800 dark:border-zinc-600">
          {error}
        </div>
      )}

      {isOpen &&
        !loading &&
        !error &&
        results.length === 0 &&
        query.trim().length >= MIN_CHARS && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg px-3 py-2 text-sm text-zinc-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400">
            Nessun risultato per "{query}"
          </div>
        )}
    </div>
  );
}
