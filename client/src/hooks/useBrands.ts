import { useEffect, useState } from "react";
import api from "../services/axios";
import type { BrandWithPerfumes } from "../types";

export const useBrands = (initialLetter: string = "A") => {
  const [allBrands, setAllBrands] = useState<BrandWithPerfumes[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async (selectedLetter: string) => {
      setLoading(true);
      try {
        const response = await api.get<BrandWithPerfumes[]>(
          `/perfumes/litter:${selectedLetter}`
        );

        console.log(response.data);

        setAllBrands(response.data);
      } catch (err) {
        console.error("Errore nel recupero dei brand:", err);
        setError("Impossibile caricare i brand. Riprova.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll(selectedLetter);
  }, []);

  return { loading, allBrands, error, selectedLetter, setSelectedLetter };
};
