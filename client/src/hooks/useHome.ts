import { useEffect, useState } from "react";
import api from "../services/axios";
import type { AccordOption, PerfumeSearchResult, Stats } from "../types";

// Accords highlighted on the home page, with a short hint of typical
// materials. Matched by name against /accords, so ids come from the DB.
const FEATURED_ACCORDS: { name: string; hint: string }[] = [
  { name: "citrus", hint: "bergamot, lemon, yuzu" },
  { name: "woody", hint: "cedar, vetiver, sandalwood" },
  { name: "floral", hint: "rose, jasmine, orange blossom" },
  { name: "powdery", hint: "iris, violet, heliotrope" },
  { name: "aquatic", hint: "calone, sea notes" },
  { name: "gourmand", hint: "vanilla, tonka, caramel" },
  { name: "leather", hint: "birch tar, suede" },
  { name: "smoky", hint: "incense, guaiac, cade" },
  { name: "green", hint: "galbanum, fig leaf" },
  { name: "spicy", hint: "pepper, cardamom, clove" },
  { name: "amber", hint: "labdanum, benzoin" },
  { name: "musky", hint: "white musks, ambrette" },
];

// Classics shown on the home page. Looked up by title (ids change every time
// the DB is rebuilt by scraper-perfumes) and matched on the brand name.
const FEATURED_PERFUMES: { query: string; brand: string }[] = [
  { query: "Eau de Shalimar", brand: "Guerlain" },
  { query: "Aventus", brand: "Creed" },
  { query: "Terre d'Hermès", brand: "Hermès" },
  { query: "Terre d'Iris", brand: "Miller Harris" },
];

export interface HomeAccord extends AccordOption {
  hint: string;
}

export const useHome = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [accords, setAccords] = useState<HomeAccord[]>([]);
  const [featured, setFeatured] = useState<PerfumeSearchResult[]>([]);

  useEffect(() => {
    // Each block loads independently: a failure only hides its own section.
    api
      .get<Stats>("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err));

    api
      .get<AccordOption[]>("/accords")
      .then((res) => {
        const byName = new Map(
          res.data.map((a) => [a.name.toLowerCase(), a] as const)
        );
        setAccords(
          FEATURED_ACCORDS.flatMap(({ name, hint }) => {
            const accord = byName.get(name);
            return accord ? [{ ...accord, hint }] : [];
          })
        );
      })
      .catch((err) => console.error("Failed to load accords:", err));

    Promise.all(
      FEATURED_PERFUMES.map(({ query, brand }) =>
        api
          .get<PerfumeSearchResult[]>("/search/perfumes", {
            params: { q: query, limit: 8 },
          })
          .then(
            (res) =>
              res.data.find((p) => p.brandName === brand) ?? res.data[0] ?? null
          )
          .catch(() => null)
      )
    ).then((results) =>
      setFeatured(results.filter((p): p is PerfumeSearchResult => p !== null))
    );
  }, []);

  return { stats, accords, featured };
};
