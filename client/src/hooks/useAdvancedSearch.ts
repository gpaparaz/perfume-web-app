import { useRef, useState } from "react";
import type { IngredientSearchResult, PerfumeSearchResult } from "../types";

export type SearchMode = "perfume" | "ingredient" | "advanced";

const ENDPOINT: Record<SearchMode, string> = {
  perfume: "/search/perfumes",
  ingredient: "/search/ingredients",
  advanced: "/search/perfumes/advanced",
};
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const LIMIT = 8;

type SearchResult = PerfumeSearchResult | IngredientSearchResult;

export const useAdvancedSearch = () => {
  const [mode, setMode] = useState<SearchMode>("perfume");
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const changeMode = (newMode: SearchMode) => {
    setMode(newMode);
    setResults([]);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return {
    mode,
    setMode: changeMode,
    query,
    setQuery,
    results,
    loading,
    error,
    clear,
  };
};
