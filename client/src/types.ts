// Interfaccia per la lista del glossario (card)
export interface IngredientSummary {
  id: number;
  name: string;
  category: string | null;
  subcategory: string | null;
  typicalVolatility: string | null;
}

// Interfaccia completa per l'inspect (scheda tecnica)
export interface Ingredient extends IngredientSummary {
  fromGlossary?: boolean;
  shortDescription?: string | null;
  botanicalName?: string | null;
  appearance?: string | null;
  odorStrength?: string | null;
  producingCountries?: string | null;
  evolutionImmediate?: string | null;
  evolutionAfterHours?: string | null;
  evolutionAfterDays?: string | null;
  fullExtractedText?: string | null;
  sourceUrl?: string | null;
  createdAt?: string;
}
