import type { CefrLevel, Language, TitleType } from "@/generated/prisma/enums";

export type { CefrLevel, Language, TitleType };

/** Serializable title summary used by cards, grids and carousels. */
export interface TitleCardData {
  id: string;
  slug: string;
  type: TitleType;
  originalTitle: string;
  localizedTitle: string | null;
  year: number;
  cefrLevel: CefrLevel;
  imdbRating: number | null;
  otherRating: number | null;
  posterUrl: string | null;
  durationMinutes: number | null;
  genres: string[];
}

export interface TitlePage {
  items: TitleCardData[];
  total: number;
  page: number;
  nextPage: number | null;
}

export interface FilterOptions {
  genres: { slug: string; name: string }[];
  countries: string[];
  years: { min: number; max: number };
}
