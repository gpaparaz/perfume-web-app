import axios from "axios";
import { useEffect, useRef, useState } from "react";
import api from "../services/axios";
import type { IngredientSummary, PartialPerfumes } from "../types";

export type SearchMode = "perfume" | "ingredient";

const ENDPOINT: Record<SearchMode, string> = {
  perfume: "/search/perfumes",
  ingredient: "/search/ingredients",
};

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const LIMIT = 8;

type SearchResult = PartialPerfumes | IngredientSummary;

export const useHeaderSearch = () => {
  const [mode, setMode] = useState<SearchMode>("perfume");
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Ricerca lato server, debounced. A differenza di useIngredients non
  // teniamo l'intero dataset in memoria: con ~114k profumi non è
  // percorribile scaricare tutto e filtrare in frontend, quindi ogni
  // digitazione (dopo il debounce) è una vera chiamata API.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < MIN_CHARS) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      api
        .get<SearchResult[]>(ENDPOINT[mode], {
          params: { q: trimmed, limit: LIMIT },
          signal: controller.signal,
        })
        .then((response) => setResults(response.data))
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.error("Errore nella ricerca:", err);
          setError("Ricerca non riuscita. Riprova.");
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, mode]);

  // Cambiare modalità con una query già presente ha senso solo se
  // invalidiamo i risultati della modalità precedente, altrimenti per un
  // istante vedresti risultati "profumo" etichettati come "ingrediente".
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
