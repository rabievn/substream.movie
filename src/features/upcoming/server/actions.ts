"use server";

import { requireUser } from "@/features/auth/server";
import { db } from "@/lib/db";

export type NotifyResult = { ok: true } | { ok: false; error: "not_found" };

export async function toggleReleaseNotification(
  titleId: string,
  isEnabled: boolean,
): Promise<NotifyResult> {
  const user = await requireUser();
  const title = await db.title.findUnique({
    where: { id: titleId },
    select: { releaseDate: true },
  });
  if (!title?.releaseDate) return { ok: false, error: "not_found" };

  if (isEnabled) {
    await db.releaseNotification.upsert({
      where: { userId_titleId: { userId: user.id, titleId } },
      create: { userId: user.id, titleId },
      update: {},
    });
  } else {
    await db.releaseNotification.deleteMany({ where: { userId: user.id, titleId } });
  }
  return { ok: true };
}
