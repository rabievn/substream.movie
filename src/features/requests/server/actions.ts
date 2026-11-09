"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/server";
import { db } from "@/lib/db";
import { titleRequestSchema, type TitleRequestInput } from "../schemas/title-request-schema";

const MAX_PENDING_REQUESTS = 20;

export async function createTitleRequest(
  values: TitleRequestInput,
): Promise<{ ok: true } | { ok: false; error: "invalid" | "limit" }> {
  const user = await requireUser("/requests");
  const parsed = titleRequestSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const pending = await db.titleRequest.count({ where: { userId: user.id, status: "PENDING" } });
  if (pending >= MAX_PENDING_REQUESTS) return { ok: false, error: "limit" };

  await db.titleRequest.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      year: parsed.data.year,
      comment: parsed.data.comment || null,
    },
  });
  revalidatePath("/requests");
  return { ok: true };
}
