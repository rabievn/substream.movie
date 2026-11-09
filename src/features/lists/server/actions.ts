"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { createListSchema, MAX_LISTS, toggleListItemSchema } from "../schemas/list-schemas";

export type ActionResult = { ok: true } | { ok: false; error: "invalid" | "not_found" | "limit" };

export async function toggleListItem(input: {
  listId: string;
  titleId: string;
  isAdded: boolean;
}): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = toggleListItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { listId, titleId, isAdded } = parsed.data;

  const list = await db.list.findFirst({
    where: { id: listId, userId: user.id },
    select: { id: true },
  });
  if (!list) return { ok: false, error: "not_found" };

  if (isAdded) {
    await db.listItem.upsert({
      where: { listId_titleId: { listId, titleId } },
      create: { listId, titleId },
      update: {},
    });
  } else {
    await db.listItem.deleteMany({ where: { listId, titleId } });
  }
  revalidatePath("/lists");
  return { ok: true };
}

export async function createList(input: { name: string }): Promise<ActionResult> {
  const user = await requireUser("/lists");
  const parsed = createListSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  if ((await db.list.count({ where: { userId: user.id } })) >= MAX_LISTS)
    return { ok: false, error: "limit" };

  await db.list.create({ data: { userId: user.id, name: parsed.data.name } });
  revalidatePath("/lists");
  return { ok: true };
}

/** System lists (watch later, favorites) can't be deleted. */
export async function deleteList(listId: string): Promise<ActionResult> {
  const user = await requireUser("/lists");
  const result = await db.list.deleteMany({
    where: { id: listId, userId: user.id, systemKey: null },
  });
  revalidatePath("/lists");
  return result.count > 0 ? { ok: true } : { ok: false, error: "not_found" };
}
