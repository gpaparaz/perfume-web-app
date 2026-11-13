// Glossary list item (card)
export interface IngredientSummary {
  id: number;
  name: string;
  category: string | null;
  subcategory: string | null;
  typicalVolatility: string | null;
  imageUrl: string;
}

// Full ingredient for the inspect page (technical sheet)
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

export interface PerfumeDetail {
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

// Advanced search: filter options and paged results
export interface BrandOption {
  id: number;
  name: string;
}

export interface AccordOption {
  id: number;
  name: string;
  nameNormalized: string;
}

export interface PerfumeSearchRow {
  id: number;
  title: string;
  brandName: string;
  releaseYear: number | null;
  imageUrl: string | null;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Stats {
  perfumes: number;
  brands: number;
  ingredients: number;
  accords: number;
}
