import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import type { TitleType } from "../types";
import { getTitles } from "./get-titles";
import { releasedWhere, titleCardSelect, toTitleCard } from "./title-select";

const genreName = (genre: { name: string; nameRu: string }, locale: Locale) =>
  locale === "ru" ? genre.nameRu : genre.name;

export async function getFeaturedTitle(locale: Locale) {
  const row = await db.title.findFirst({
    where: releasedWhere(),
    orderBy: [{ isFeatured: "desc" }, { popularity: "desc" }],
    select: {
      ...titleCardSelect,
      tagline: true,
      description: true,
      descriptionRu: true,
      backdropUrl: true,
      genres: { select: { genre: { select: { slug: true, name: true, nameRu: true } } } },
    },
  });
  if (!row) return null;
  return {
    ...toTitleCard(row),
    tagline: row.tagline,
    description: locale === "ru" && row.descriptionRu ? row.descriptionRu : row.description,
    backdropUrl: row.backdropUrl,
    genreNames: row.genres.map(({ genre }) => genreName(genre, locale)),
  };
}

export type FeaturedTitle = NonNullable<Awaited<ReturnType<typeof getFeaturedTitle>>>;

export async function getTopTitles(type: TitleType, take = 12) {
  const page = await getTitles({ type, sort: "popular", page: 1 }, take);
  return page.items;
}

export async function getUpcomingTitles(locale: Locale, take = 6) {
  const rows = await db.title.findMany({
    where: { releaseDate: { gt: new Date() } },
    orderBy: { releaseDate: "asc" },
    take,
    select: {
      ...titleCardSelect,
      description: true,
      descriptionRu: true,
      releaseDate: true,
      genres: { select: { genre: { select: { slug: true, name: true, nameRu: true } } } },
    },
  });
  return rows.map((row) => ({
    ...toTitleCard(row),
    releaseDate: row.releaseDate!.toISOString(),
    description: locale === "ru" && row.descriptionRu ? row.descriptionRu : row.description,
    genreNames: row.genres.map(({ genre }) => genreName(genre, locale)),
  }));
}

export type UpcomingTitle = Awaited<ReturnType<typeof getUpcomingTitles>>[number];

export function getTopPeople(take = 12) {
  return db.person.findMany({
    orderBy: { popularity: "desc" },
    take,
    select: { id: true, slug: true, name: true, photoUrl: true },
  });
}

export async function getCollections(locale: Locale) {
  const rows = await db.collection.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      nameRu: true,
      description: true,
      descriptionRu: true,
      _count: { select: { items: true } },
      items: {
        orderBy: { order: "asc" },
        take: 3,
        select: { title: { select: { slug: true, originalTitle: true, posterUrl: true } } },
      },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: locale === "ru" ? row.nameRu : row.name,
    description: locale === "ru" ? (row.descriptionRu ?? row.description) : row.description,
    count: row._count.items,
    previews: row.items.map(({ title }) => title),
  }));
}

export type CollectionSummary = Awaited<ReturnType<typeof getCollections>>[number];
