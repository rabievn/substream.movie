/**
 * Minimal spaced repetition: each successful review moves the word to the next interval.
 * A miss sends it back to the start. After the last interval the word is KNOWN.
 */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export type WordStatus = "NEW" | "LEARNING" | "KNOWN";

export interface ReviewState {
  reviewCount: number;
  status: WordStatus;
  nextReviewAt: Date;
}

export function applyReview(
  isRemembered: boolean,
  reviewCount: number,
  now = new Date(),
): ReviewState {
  if (!isRemembered) {
    return {
      reviewCount: 0,
      status: "LEARNING",
      nextReviewAt: new Date(now.getTime() + 10 * 60 * 1000),
    };
  }
  const nextCount = reviewCount + 1;
  if (nextCount > REVIEW_INTERVALS_DAYS.length) {
    return {
      reviewCount: nextCount,
      status: "KNOWN",
      nextReviewAt: new Date(now.getTime() + 90 * DAY_MS),
    };
  }
  const days = REVIEW_INTERVALS_DAYS[nextCount - 1]!;
  return {
    reviewCount: nextCount,
    status: "LEARNING",
    nextReviewAt: new Date(now.getTime() + days * DAY_MS),
  };
}

/** Lowercase, trim punctuation and curly quotes: "Don’t," → "don't" */
export const normalizeWord = (word: string) =>
  word
    .trim()
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
