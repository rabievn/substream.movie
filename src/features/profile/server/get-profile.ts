import "server-only";
import { db } from "@/lib/db";

export async function getProfile(userId: string) {
  const [user, savedWords, titlesStarted] = await Promise.all([
    db.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        locale: true,
        createdAt: true,
        subscription: { select: { plan: true, status: true, expiresAt: true } },
      },
    }),
    db.savedWord.count({ where: { userId } }),
    db.watchProgress.count({ where: { userId } }),
  ]);
  return { ...user, stats: { savedWords, titlesStarted } };
}

export type Profile = Awaited<ReturnType<typeof getProfile>>;
