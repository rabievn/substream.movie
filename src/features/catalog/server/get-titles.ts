import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { CATALOG_PAGE_SIZE } from "../constants";
import type { TitleFilter } from "../schemas/title-filter-schema";
import type { TitlePage } from "../types";
import { releasedWhere, titleCardSelect, toTitleCard } from "./title-select";

const ORDER_BY: Record<TitleFilter["sort"], Prisma.TitleOrderByWithRelationInput[]> = {
  popular: [{ popularity: "desc" }, { id: "asc" }],
  new: [{ createdAt: "desc" }, { id: "asc" }],
  imdb: [{ imdbRating: { sort: "desc", nulls: "last" } }, { id: "asc" }],
  rating: [{ otherRating: { sort: "desc", nulls: "last" } }, { id: "asc" }],
};

export function buildTitleWhere(filter: TitleFilter): Prisma.TitleWhereInput {
  return {
    AND: [
      releasedWhere(),
      filter.type ? { type: filter.type } : {},
      filter.lang ? { language: filter.lang } : {},
      filter.level?.length ? { cefrLevel: { in: filter.level } } : {},
      filter.genre ? { genres: { some: { genre: { slug: filter.genre } } } } : {},
      filter.from || filter.to ? { year: { gte: filter.from, lte: filter.to } } : {},
      filter.country ? { countries: { has: filter.country } } : {},
    ],
  };
}

export async function getTitles(
  filter: TitleFilter,
  pageSize = CATALOG_PAGE_SIZE,
): Promise<TitlePage> {
  const where = buildTitleWhere(filter);
  const [rows, total] = await Promise.all([
    db.title.findMany({
      where,
      orderBy: ORDER_BY[filter.sort],
      skip: (filter.page - 1) * pageSize,
      take: pageSize,
      select: titleCardSelect,
    }),
    db.title.count({ where }),
  ]);

  return {
    items: rows.map(toTitleCard),
    total,
    page: filter.page,
    nextPage: filter.page * pageSize < total ? filter.page + 1 : null,
  };
}
