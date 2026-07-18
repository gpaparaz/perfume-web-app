import { useCallback, useEffect, useState } from "react";
import api from "../services/axios";
import type { Ingredient } from "../types";

export const useIngredients = (initialLetter: string = "") => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async (letter: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = letter ? `/glossary?letter=${letter}` : "/glossary";
      const response = await api.get<Ingredient[]>(endpoint);
      setIngredients(response.data);
    } catch (err) {
      console.error("Errore nel recupero degli ingredienti:", err);
      setError("Impossibile caricare gli ingredienti. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients(selectedLetter);
  }, [selectedLetter, fetchIngredients]);

  const toggleLetter = (letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? "" : letter));
  };

  return {
    ingredients,
    selectedLetter,
    loading,
    error,
    toggleLetter,
    refetch: () => fetchIngredients(selectedLetter),
  };
};
