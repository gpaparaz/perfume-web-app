import { useEffect, useMemo, useState } from "react";
import api from "../services/axios";
import type { IngredientSummary } from "../types";

export const useIngredients = () => {
  const [allIngredients, setAllIngredients] = useState<IngredientSummary[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial global fetch of the lightweight cards
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get<IngredientSummary[]>("/ingredient");
        setAllIngredients(response.data);
      } catch (err) {
        console.error("Failed to fetch the glossary:", err);
        setError("Could not load the glossary. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Combined client-side filter: applies both the letter and the text search
  const filteredIngredients = useMemo(() => {
    return allIngredients.filter((ingredient) => {
      // 1. Check the initial letter (if selected)
      const matchesLetter = selectedLetter
        ? ingredient.name
            .trim()
            .toLowerCase()
            .startsWith(selectedLetter.toLowerCase())
        : true;

      // 2. Check the text typed in the search bar (matches name or subcategory)
      const matchesSearch = searchQuery
        ? ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ingredient.subcategory
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      return matchesLetter && matchesSearch;
    });
  }, [allIngredients, selectedLetter, searchQuery]);

  const toggleLetter = (letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? "" : letter));
  };

  return {
    ingredients: filteredIngredients,
    selectedLetter,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    toggleLetter,
  };
};
