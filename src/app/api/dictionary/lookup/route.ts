import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { lookupQuerySchema, normalizeWordForLookup } from "@/features/dictionary";
import { findSavedWordId, translateWord } from "@/features/dictionary/server";
import { jsonError } from "@/lib/api-response";
import { getLocale } from "@/lib/i18n/get-locale";

/** GET /api/dictionary/lookup?word=Running → { word: "run", translation, source, savedWordId } */
export async function GET(request: NextRequest) {
  const parsed = lookupQuerySchema.safeParse({
    word: request.nextUrl.searchParams.get("word") ?? "",
  });
  if (!parsed.success) return jsonError(400, "invalid_word");

  const word = normalizeWordForLookup(parsed.data.word);
  const locale = await getLocale();
  const [result, user] = await Promise.all([
    translateWord(word, locale === "en" ? "ru" : locale),
    getCurrentUser(),
  ]);
  const savedWordId = user ? await findSavedWordId(user.id, result.word) : null;

  return Response.json({ ...result, savedWordId });
}
