import { useEffect, useState } from "react";
import api from "../services/axios";
import type { BrandWithPerfumes } from "../types";

export const useBrands = () => {
  const [allBrands, setAllBrands] = useState<BrandWithPerfumes[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const response = await api.get<BrandWithPerfumes[]>("/");

        setAllBrands(response.data);
      } catch (err) {
        console.error("Errore nel recupero del glossario:", err);
        setError("Impossibile caricare i brand. Riprova.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { loading, allBrands, error };
};
