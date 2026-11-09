import "server-only";
import { z } from "zod";
import { lookupGlossary } from "./glossary";

const apiResponseSchema = z.object({ translatedText: z.string() });

/**
 * Translates a single word EN → target language.
 * 1. Built-in glossary (offline).
 * 2. Optional LibreTranslate-compatible API: TRANSLATE_API_URL (+ TRANSLATE_API_KEY).
 */
export async function translateWord(word: string, target: string) {
  const fromGlossary = target === "ru" ? lookupGlossary(word) : null;
  if (fromGlossary)
    return {
      word: fromGlossary.lemma,
      translation: fromGlossary.translation,
      source: "glossary" as const,
    };

  const apiUrl = process.env.TRANSLATE_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: word,
          source: "en",
          target,
          format: "text",
          api_key: process.env.TRANSLATE_API_KEY,
        }),
        signal: AbortSignal.timeout(4000),
      });
      const parsed = apiResponseSchema.safeParse(await response.json());
      if (response.ok && parsed.success && parsed.data.translatedText) {
        return { word, translation: parsed.data.translatedText, source: "api" as const };
      }
    } catch {
      // Fall through: the user can type a translation manually.
    }
  }
  return { word, translation: null, source: null };
}
