import { useEffect, useMemo, useState } from "react";
import api from "../services/axios";
import type { Ingredient } from "../types";

export const useIngredients = () => {
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get<Ingredient[]>("/glossary");
        setAllIngredients(response.data);
      } catch (err) {
        console.error("Errore nel recupero del glossario:", err);
        setError("Impossibile caricare il glossario. Riprova.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredIngredients = useMemo(() => {
    if (!selectedLetter) return allIngredients;

    return allIngredients.filter((ingredient) =>
      ingredient.name
        .trim()
        .toLowerCase()
        .startsWith(selectedLetter.toLowerCase())
    );
  }, [allIngredients, selectedLetter]);

  const toggleLetter = (letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? "" : letter));
  };

  return {
    ingredients: filteredIngredients,
    selectedLetter,
    loading,
    error,
    toggleLetter,
  };
};
