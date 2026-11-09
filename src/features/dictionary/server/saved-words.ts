import "server-only";
import { db } from "@/lib/db";
import { applyReview, normalizeWord } from "../lib/srs";
import { MAX_SAVED_WORDS, type SaveWordInput, type UpdateWordInput } from "../schemas/word-schemas";
import type { SavedWord } from "../types";

const savedWordSelect = {
  id: true,
  word: true,
  translation: true,
  context: true,
  status: true,
  reviewCount: true,
  nextReviewAt: true,
  createdAt: true,
  title: { select: { slug: true, originalTitle: true } },
} as const;

const toSavedWord = (row: {
  id: string;
  word: string;
  translation: string;
  context: string | null;
  status: SavedWord["status"];
  reviewCount: number;
  nextReviewAt: Date;
  createdAt: Date;
  title: SavedWord["title"];
}): SavedWord => ({
  ...row,
  nextReviewAt: row.nextReviewAt.toISOString(),
  isDue: row.status !== "KNOWN" && row.nextReviewAt.getTime() <= Date.now(),
  createdAt: row.createdAt.toISOString(),
});

export async function listSavedWords(userId: string) {
  const rows = await db.savedWord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: savedWordSelect,
  });
  return rows.map(toSavedWord);
}

export async function findSavedWordId(userId: string, word: string) {
  const row = await db.savedWord.findUnique({
    where: { userId_word: { userId, word: normalizeWord(word) } },
    select: { id: true },
  });
  return row?.id ?? null;
}

export class WordLimitError extends Error {}

export async function saveWord(userId: string, input: SaveWordInput) {
  const word = normalizeWord(input.word);
  const existing = await db.savedWord.findUnique({
    where: { userId_word: { userId, word } },
    select: { id: true },
  });
  if (!existing && (await db.savedWord.count({ where: { userId } })) >= MAX_SAVED_WORDS) {
    throw new WordLimitError();
  }
  const data = {
    translation: input.translation,
    context: input.context ?? null,
    titleId: input.titleId ?? null,
    timestamp: input.timestamp ?? null,
  };
  const row = await db.savedWord.upsert({
    where: { userId_word: { userId, word } },
    create: { userId, word, ...data },
    update: data,
    select: savedWordSelect,
  });
  return toSavedWord(row);
}

/** Returns null if the word doesn't belong to the user. */
export async function updateSavedWord(userId: string, id: string, input: UpdateWordInput) {
  const result = await db.savedWord.updateMany({ where: { id, userId }, data: input });
  return result.count > 0;
}

export async function reviewSavedWord(userId: string, id: string, isRemembered: boolean) {
  const word = await db.savedWord.findFirst({
    where: { id, userId },
    select: { reviewCount: true },
  });
  if (!word) return false;
  await db.savedWord.update({ where: { id }, data: applyReview(isRemembered, word.reviewCount) });
  return true;
}

export async function deleteSavedWord(userId: string, id: string) {
  const result = await db.savedWord.deleteMany({ where: { id, userId } });
  return result.count > 0;
}
