import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { TitleCardData } from "../types";

export const titleCardSelect = {
  id: true,
  slug: true,
  type: true,
  originalTitle: true,
  localizedTitle: true,
  year: true,
  cefrLevel: true,
  imdbRating: true,
  otherRating: true,
  posterUrl: true,
  durationMinutes: true,
  genres: { select: { genre: { select: { slug: true } } } },
} satisfies Prisma.TitleSelect;

type TitleCardRow = Prisma.TitleGetPayload<{ select: typeof titleCardSelect }>;

/** Converts a DB row to plain JSON (Decimal → number). */
export const toTitleCard = (row: TitleCardRow): TitleCardData => ({
  id: row.id,
  slug: row.slug,
  type: row.type,
  originalTitle: row.originalTitle,
  localizedTitle: row.localizedTitle,
  year: row.year,
  cefrLevel: row.cefrLevel,
  imdbRating: row.imdbRating?.toNumber() ?? null,
  otherRating: row.otherRating?.toNumber() ?? null,
  posterUrl: row.posterUrl,
  durationMinutes: row.durationMinutes,
  genres: row.genres.map(({ genre }) => genre.slug),
});

/** Released = no release date, or a release date in the past. */
export const releasedWhere = (): Prisma.TitleWhereInput => ({
  OR: [{ releaseDate: null }, { releaseDate: { lte: new Date() } }],
});
