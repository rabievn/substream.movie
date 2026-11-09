import { z } from "zod";

export const MAX_SAVED_WORDS = 5000;

export const saveWordSchema = z.object({
  word: z.string().trim().min(1).max(64),
  translation: z.string().trim().min(1).max(200),
  context: z.string().trim().max(500).nullish(),
  titleId: z.string().max(64).nullish(),
  timestamp: z.number().int().min(0).nullish(),
});
export type SaveWordInput = z.infer<typeof saveWordSchema>;

export const reviewWordSchema = z.object({ isRemembered: z.boolean() });
export type ReviewWordInput = z.infer<typeof reviewWordSchema>;

export const updateWordSchema = z.object({
  translation: z.string().trim().min(1).max(200).optional(),
  status: z.enum(["NEW", "LEARNING", "KNOWN"]).optional(),
});
export type UpdateWordInput = z.infer<typeof updateWordSchema>;

export const lookupQuerySchema = z.object({ word: z.string().trim().min(1).max(64) });
