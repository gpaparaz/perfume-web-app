import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useHeaderSearch } from "../hooks/useHeaderSearch";
import type { IngredientSearchResult } from "../types";

const MIN_CHARS = 2;

interface NotePickerProps {
  selected: IngredientSearchResult[];
  onAdd: (note: IngredientSearchResult) => void;
  onRemove: (id: number) => void;
}

// Ingredient autocomplete that collects the chosen notes as removable chips.
// Reuses the header search hook, locked to ingredient mode.
export default function NotePicker({ selected, onAdd, onRemove }: NotePickerProps) {
  const { query, setQuery, results, loading, error, clear } =
    useHeaderSearch("ingredient");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIds = new Set(selected.map((n) => n.id));
  const options = (results as IngredientSearchResult[]).filter(
    (r) => !selectedIds.has(r.id)
  );

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

  function pick(note: IngredientSearchResult) {
    onAdd(note);
    clear();
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      onRemove(selected[selected.length - 1].id);
      return;
    }
    if (!isOpen || options.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(options[activeIndex >= 0 ? activeIndex : 0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showDropdown = isOpen && query.trim().length >= MIN_CHARS;

  return (
    <div ref={containerRef} className="position-relative">
      {selected.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {selected.map((note) => (
            <span
              key={note.id}
              className="badge rounded-pill text-bg-secondary d-inline-flex align-items-center gap-1"
            >
              {note.name}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.5rem" }}
                aria-label={`Remove ${note.name}`}
                onClick={() => onRemove(note.id)}
              />
            </span>
          ))}
        </div>
      )}

      <div className="input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Add a note (e.g. bergamot)..."
          className="form-control"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {loading && (
          <span className="input-group-text" aria-hidden="true">
            <span className="spinner-border spinner-border-sm" role="status" />
          </span>
        )}
      </div>

      {showDropdown && options.length > 0 && (
        <ul
          role="listbox"
          className="dropdown-menu show w-100 mt-1 shadow-sm"
          style={{ maxHeight: "16rem", overflowY: "auto" }}
        >
          {options.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => pick(item)}
                className={`dropdown-item d-flex align-items-center gap-2 ${
                  i === activeIndex ? "active" : ""
                }`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="rounded flex-shrink-0"
                    style={{ width: "1.75rem", height: "1.75rem", objectFit: "cover" }}
                    loading="lazy"
                  />
                )}
                <span className="text-truncate">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && !loading && error && (
        <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-danger">
          {error}
        </div>
      )}

      {showDropdown && !loading && !error && options.length === 0 && (
        <div className="dropdown-menu show w-100 mt-1 shadow-sm px-3 py-2 small text-muted">
          No notes found for "{query}"
        </div>
      )}
    </div>
  );
}
