import {
  CatalogView,
  parseTitleFilter,
  TYPE_BY_SECTION,
  type CatalogSection,
  type SearchParamsRecord,
} from "@/features/catalog";
import { getFilterOptions, getTitles } from "@/features/catalog/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";

const HEADING_KEY = {
  movies: "moviesTitle",
  series: "seriesTitle",
  cartoons: "cartoonsTitle",
} as const satisfies Record<CatalogSection, string>;

export async function CatalogPage({
  section,
  searchParams,
}: {
  section: CatalogSection;
  searchParams: Promise<SearchParamsRecord>;
}) {
  const type = TYPE_BY_SECTION[section];
  // The section decides the type; the grid always starts from page 1.
  const filter = { ...parseTitleFilter(await searchParams), type, page: 1 };
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const [firstPage, options] = await Promise.all([
    getTitles(filter),
    getFilterOptions(type, locale),
  ]);

  return (
    <CatalogView
      heading={t.catalog[HEADING_KEY[section]]}
      filter={filter}
      firstPage={firstPage}
      options={options}
      t={t}
      locale={locale}
    />
  );
}
