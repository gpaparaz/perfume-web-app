import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/axios";
import type {
  AccordOption,
  BrandOption,
  IngredientSearchResult,
  Page,
  PerfumeSearchRow,
} from "../types";

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 25;

export interface AdvancedSearchFilters {
  name: string;
  brandId: number | null;
  accordIds: number[];
  // Full objects (not just ids) so the selected notes can be shown as chips.
  notes: IngredientSearchResult[];
  yearFrom: string;
  yearTo: string;
}

export const EMPTY_FILTERS: AdvancedSearchFilters = {
  name: "",
  brandId: null,
  accordIds: [],
  notes: [],
  yearFrom: "",
  yearTo: "",
};

function parseYear(value: string): number | undefined {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

// Turns the UI filters into the query params expected by
// GET /search/perfumes/advanced (empty values are omitted).
function toParams(f: AdvancedSearchFilters) {
  const params: Record<string, string | number | number[]> = {};
  if (f.name.trim()) params.name = f.name.trim();
  if (f.brandId !== null) params.brandId = f.brandId;
  if (f.accordIds.length > 0) params.accordIds = f.accordIds;
  if (f.notes.length > 0) params.noteIds = f.notes.map((n) => n.id);
  const yearFrom = parseYear(f.yearFrom);
  const yearTo = parseYear(f.yearTo);
  if (yearFrom !== undefined) params.yearFrom = yearFrom;
  if (yearTo !== undefined) params.yearTo = yearTo;
  return params;
}

export const useAdvancedSearch = () => {
  // Filter options (brands / accords) loaded once on mount.
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [accords, setAccords] = useState<AccordOption[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // Accords can be preselected from the URL (?accord=12&accord=40), e.g.
  // by the accord tiles on the home page. Read once, on mount.
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<AdvancedSearchFilters>(() => ({
    ...EMPTY_FILTERS,
    accordIds: searchParams
      .getAll("accord")
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0),
  }));
  const [page, setPage] = useState<number>(0);

  const [result, setResult] = useState<Page<PerfumeSearchRow> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<BrandOption[]>("/brands"),
      api.get<AccordOption[]>("/accords"),
    ])
      .then(([brandsRes, accordsRes]) => {
        setBrands(brandsRes.data);
        setAccords(accordsRes.data);
      })
      .catch((err) => {
        console.error("Failed to load filter options:", err);
        setOptionsError("Could not load brands and accords.");
      });
  }, []);

  const params = useMemo(() => toParams(filters), [filters]);
  const hasFilters = Object.keys(params).length > 0;
  // Stable key so the search effect only re-runs when the actual query changes.
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    // No filters: nothing to fetch. Stale result/error are hidden by the
    // returned values below instead of being reset here.
    if (!hasFilters) {
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      api
        .get<Page<PerfumeSearchRow>>("/search/perfumes/advanced", {
          params: { ...params, page, size: PAGE_SIZE },
          // Spring binds List<Long> from repeated keys (accordIds=1&accordIds=2),
          // not from axios' default "accordIds[]=1" format.
          paramsSerializer: { indexes: null },
          signal: controller.signal,
        })
        .then((response) => setResult(response.data))
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.error("Advanced search failed:", err);
          setError("Search failed. Please try again.");
          setResult(null);
        })
        .finally(() => {
          if (abortRef.current === controller) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // paramsKey stands in for params: same content => same key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, page, hasFilters]);

  // Any filter change restarts from the first page.
  const updateFilters = (patch: Partial<AdvancedSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  };

  const toggleAccord = (id: number) => {
    updateFilters({
      accordIds: filters.accordIds.includes(id)
        ? filters.accordIds.filter((a) => a !== id)
        : [...filters.accordIds, id],
    });
  };

  const addNote = (note: IngredientSearchResult) => {
    if (filters.notes.some((n) => n.id === note.id)) return;
    updateFilters({ notes: [...filters.notes, note] });
  };

  const removeNote = (id: number) => {
    updateFilters({ notes: filters.notes.filter((n) => n.id !== id) });
  };

  const reset = () => {
    setFilters(EMPTY_FILTERS);
    setPage(0);
  };

  return {
    brands,
    accords,
    optionsError,
    filters,
    updateFilters,
    toggleAccord,
    addNote,
    removeNote,
    reset,
    hasFilters,
    page,
    setPage,
    result: hasFilters ? result : null,
    loading: hasFilters && loading,
    error: hasFilters ? error : null,
  };
};
