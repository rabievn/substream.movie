import type { WordStatus } from "./lib/srs";

export interface SavedWord {
  id: string;
  word: string;
  translation: string;
  context: string | null;
  status: WordStatus;
  reviewCount: number;
  nextReviewAt: string;
  /** Computed by the server at request time */
  isDue: boolean;
  createdAt: string;
  title: { slug: string; originalTitle: string } | null;
}

export interface WordLookup {
  word: string;
  translation: string | null;
  source: "glossary" | "api" | null;
  savedWordId: string | null;
}
