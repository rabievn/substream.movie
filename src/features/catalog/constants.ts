export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const LANGUAGES = ["EN", "ES", "FR", "DE", "IT"] as const;
export const TITLE_TYPES = ["MOVIE", "SERIES", "CARTOON"] as const;
export const SORT_OPTIONS = ["popular", "new", "imdb", "rating"] as const;
export const CATALOG_PAGE_SIZE = 18;

/** URL slug ↔ title type */
export const TYPE_BY_SECTION = {
  movies: "MOVIE",
  series: "SERIES",
  cartoons: "CARTOON",
} as const;

export type CatalogSection = keyof typeof TYPE_BY_SECTION;
