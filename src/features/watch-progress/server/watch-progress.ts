import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { isFinished, type UpdateWatchProgressInput } from "../schemas/watch-progress-schema";

export async function upsertWatchProgress(userId: string, input: UpdateWatchProgressInput) {
  const data = {
    episodeId: input.episodeId ?? null,
    positionSeconds: Math.floor(input.positionSeconds),
    durationSeconds: Math.ceil(input.durationSeconds),
    isFinished: isFinished(input.positionSeconds, input.durationSeconds),
  };
  // Ignore progress for unknown titles/episodes instead of failing on FK errors.
  const title = await db.title.findUnique({ where: { id: input.titleId }, select: { id: true } });
  if (!title) return false;
  await db.watchProgress.upsert({
    where: { userId_titleId: { userId, titleId: input.titleId } },
    create: { userId, titleId: input.titleId, ...data },
    update: data,
  });
  return true;
}

/** Saved position for this title/episode, or 0. */
export async function getResumePosition(userId: string, titleId: string, episodeId: string | null) {
  const progress = await db.watchProgress.findUnique({
    where: { userId_titleId: { userId, titleId } },
    select: { episodeId: true, positionSeconds: true, isFinished: true },
  });
  if (!progress || progress.isFinished || progress.episodeId !== episodeId) return 0;
  return progress.positionSeconds;
}

export async function getContinueWatching(userId: string, locale: Locale, take = 12) {
  const rows = await db.watchProgress.findMany({
    where: { userId, isFinished: false },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      positionSeconds: true,
      durationSeconds: true,
      updatedAt: true,
      title: {
        select: {
          slug: true,
          originalTitle: true,
          localizedTitle: true,
          posterUrl: true,
          backdropUrl: true,
        },
      },
      episode: { select: { id: true, number: true, season: { select: { number: true } } } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    href: `/watch/${row.title.slug}${row.episode ? `?e=${row.episode.id}` : ""}`,
    slug: row.title.slug,
    originalTitle: row.title.originalTitle,
    displayTitle:
      locale === "ru" && row.title.localizedTitle
        ? row.title.localizedTitle
        : row.title.originalTitle,
    posterUrl: row.title.backdropUrl ?? row.title.posterUrl,
    episode: row.episode ? { season: row.episode.season.number, number: row.episode.number } : null,
    progress: row.durationSeconds ? row.positionSeconds / row.durationSeconds : 0,
    remainingSeconds: Math.max(0, row.durationSeconds - row.positionSeconds),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export type ContinueWatchingItem = Awaited<ReturnType<typeof getContinueWatching>>[number];
