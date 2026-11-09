import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import type { FilterOptions, TitleType } from "../types";
import { releasedWhere } from "./title-select";

export async function getFilterOptions(
  type: TitleType | undefined,
  locale: Locale,
): Promise<FilterOptions> {
  const where = { AND: [releasedWhere(), type ? { type } : {}] };
  const [genres, countries, years] = await Promise.all([
    db.genre.findMany({
      where: { titles: { some: { title: where } } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true, nameRu: true },
    }),
    db.title.findMany({ where, select: { countries: true } }),
    db.title.aggregate({ where, _min: { year: true }, _max: { year: true } }),
  ]);

  const currentYear = new Date().getFullYear();
  return {
    genres: genres.map((genre) => ({
      slug: genre.slug,
      name: locale === "ru" ? genre.nameRu : genre.name,
    })),
    countries: [...new Set(countries.flatMap((title) => title.countries))].sort(),
    years: { min: years._min.year ?? currentYear, max: years._max.year ?? currentYear },
  };
}
