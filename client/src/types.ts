export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  subcategory?: string;
  shortDescription?: string;
  botanicalName?: string;
  appearance?: string;
  odorStrength?: string;
  producingCountries?: string;
  typicalVolatility?: string;
  evolutionImmediate?: string;
  evolutionAfterHours?: string;
  evolutionAfterDays?: string;
  fullExtractedText?: string;
  sourceUrl?: string;
  createdAt?: string;
}
