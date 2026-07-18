// Interfaccia per la lista del glossario (card)
export interface IngredientSummary {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  typicalVolatility: string;
}

// Interfaccia completa per l'inspect (scheda tecnica)
export interface Ingredient extends IngredientSummary {
  shortDescription?: string;
  botanicalName?: string;
  appearance?: string;
  odorStrength?: string;
  producingCountries?: string;
  evolutionImmediate?: string;
  evolutionAfterHours?: string;
  evolutionAfterDays?: string;
  fullExtractedText?: string;
  sourceUrl?: string;
  createdAt?: string;
}
