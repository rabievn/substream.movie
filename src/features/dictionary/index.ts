export { DictionaryView } from "./components/dictionary-view";
export { WordLookupPanel, type WordLookupTarget } from "./components/word-lookup-panel";
export {
  applyReview,
  normalizeWord,
  normalizeWord as normalizeWordForLookup,
  REVIEW_INTERVALS_DAYS,
} from "./lib/srs";
export {
  lookupQuerySchema,
  MAX_SAVED_WORDS,
  reviewWordSchema,
  saveWordSchema,
  updateWordSchema,
  type ReviewWordInput,
  type SaveWordInput,
  type UpdateWordInput,
} from "./schemas/word-schemas";
export type { SavedWord, WordLookup } from "./types";
