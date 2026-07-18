import { useEffect, useMemo, useState } from "react";
import api from "../services/axios";
import type { IngredientSummary } from "../types";

export const useIngredients = () => {
  const [allIngredients, setAllIngredients] = useState<IngredientSummary[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch iniziale globale delle card leggere
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get<IngredientSummary[]>("/glossary");
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

  // Filtro combinato a frontend: applica sia la lettera che la ricerca testuale
  const filteredIngredients = useMemo(() => {
    return allIngredients.filter((ingredient) => {
      // 1. Controlla la lettera iniziale (se selezionata)
      const matchesLetter = selectedLetter
        ? ingredient.name
            .trim()
            .toLowerCase()
            .startsWith(selectedLetter.toLowerCase())
        : true;

      // 2. Controlla il testo scritto nella barra di ricerca (cerca nel nome o nella sotto-categoria)
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
