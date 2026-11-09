import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { titleCardSelect, toTitleCard } from "./title-select";

/** Full title page data. Cached per request (used by metadata + page). */
export const getTitleDetails = cache(async (slug: string, locale: Locale) => {
  const row = await db.title.findUnique({
    where: { slug },
    select: {
      ...titleCardSelect,
      tagline: true,
      description: true,
      descriptionRu: true,
      language: true,
      countries: true,
      ageRating: true,
      backdropUrl: true,
      releaseDate: true,
      videoUrl: true,
      genres: { select: { genre: { select: { slug: true, name: true, nameRu: true } } } },
      credits: {
        orderBy: [{ role: "asc" }, { order: "asc" }],
        select: {
          role: true,
          character: true,
          person: { select: { slug: true, name: true } },
        },
      },
      seasons: {
        orderBy: { number: "asc" },
        select: {
          id: true,
          number: true,
          name: true,
          episodes: {
            orderBy: { number: "asc" },
            select: { id: true, number: true, name: true, durationSeconds: true },
          },
        },
      },
    },
  });
  if (!row) return null;

  const isUpcoming = Boolean(row.releaseDate && row.releaseDate > new Date());
  return {
    ...toTitleCard(row),
    tagline: row.tagline,
    description: locale === "ru" && row.descriptionRu ? row.descriptionRu : row.description,
    language: row.language,
    countries: row.countries,
    ageRating: row.ageRating,
    backdropUrl: row.backdropUrl,
    releaseDate: row.releaseDate?.toISOString() ?? null,
    isUpcoming,
    isPlayable:
      !isUpcoming && (Boolean(row.videoUrl) || row.seasons.some((s) => s.episodes.length > 0)),
    genreList: row.genres.map(({ genre }) => ({
      slug: genre.slug,
      name: locale === "ru" ? genre.nameRu : genre.name,
    })),
    cast: row.credits
      .filter((credit) => credit.role === "ACTOR")
      .map((credit) => ({ ...credit.person, character: credit.character })),
    directors: row.credits
      .filter((credit) => credit.role === "DIRECTOR")
      .map((credit) => credit.person),
    seasons: row.seasons,
  };
});

export type TitleDetails = NonNullable<Awaited<ReturnType<typeof getTitleDetails>>>;
export type SeasonDetails = TitleDetails["seasons"][number];

export async function getPersonWithTitles(slug: string) {
  const person = await db.person.findUnique({
    where: { slug },
    select: {
      name: true,
      bio: true,
      credits: {
        orderBy: { title: { year: "desc" } },
        select: { role: true, character: true, title: { select: titleCardSelect } },
      },
    },
  });
  if (!person) return null;
  return {
    name: person.name,
    bio: person.bio,
    credits: person.credits.map((credit) => ({
      role: credit.role,
      character: credit.character,
      title: toTitleCard(credit.title),
    })),
  };
}
