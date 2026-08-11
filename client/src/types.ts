// Interfaccia per la lista del glossario (card)
export interface IngredientSummary {
  id: number;
  name: string;
  category: string | null;
  subcategory: string | null;
  typicalVolatility: string | null;
  imageUrl: string;
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

export interface Brand {
  id: number;
  name: string;
}

export interface PartialPerfumes {
  id: number;
  brandId: number;
  title: string;
  imageUrl: string;
  releaseYear: string;
}

export interface BrandWithPerfumes extends Brand {
  perfumes: PartialPerfumes[];
}

export interface NoteDetail {
  ingredientId: number;
  name: string;
  imageUrl: string | null;
  fromGlossary: boolean;
}

export interface AccordDetail {
  id: number;
  name: string;
  rank: number;
}

export interface FragranceDetail {
  id: number;
  title: string;
  description: string | null;
  releaseYear: number | null;
  perfumer: string | null;
  imageUrl: string | null;
  brandId: number;
  brandName: string;
  top: NoteDetail[];
  heart: NoteDetail[];
  base: NoteDetail[];
  accords: AccordDetail[];
}

export interface PerfumeSearchResult {
  id: number;
  title: string;
  brandName: string | null;
  imageUrl: string | null;
}

export interface IngredientSearchResult {
  id: number;
  name: string;
  imageUrl: string | null;
}
