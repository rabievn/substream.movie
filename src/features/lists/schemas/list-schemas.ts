import { z } from "zod";

export const MAX_LISTS = 30;
export const SYSTEM_LIST_KEYS = ["watch-later", "favorites"] as const;

export const listNameSchema = z.string().trim().min(1).max(60);
export const createListSchema = z.object({ name: listNameSchema });
export type CreateListInput = z.infer<typeof createListSchema>;

export const toggleListItemSchema = z.object({
  listId: z.string().min(1).max(64),
  titleId: z.string().min(1).max(64),
  isAdded: z.boolean(),
});
