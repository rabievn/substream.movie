import { z } from "zod";
import { CEFR_LEVELS, LANGUAGES, SORT_OPTIONS, TITLE_TYPES } from "../constants";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/** Ignores invalid values instead of failing: URLs are user input. */
const optionalYear = z.coerce
  .number()
  .int()
  .min(MIN_YEAR)
  .max(MAX_YEAR)
  .optional()
  .catch(undefined);

const levelList = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((level) => level.trim().toUpperCase())
      .filter((level): level is (typeof CEFR_LEVELS)[number] =>
        (CEFR_LEVELS as readonly string[]).includes(level),
      ),
  )
  .optional()
  .catch(undefined);

/**
 * Catalog filters as they appear in the URL (?lang=EN&level=A2,B1&genre=drama&from=2015&to=2024&country=US&sort=new).
 * The URL is the source of truth; this schema is shared by pages, the API route and the client.
 */
export const titleFilterSchema = z.object({
  type: z.enum(TITLE_TYPES).optional().catch(undefined),
  lang: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(LANGUAGES))
    .optional()
    .catch(undefined),
  level: levelList,
  genre: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .catch(undefined),
  from: optionalYear,
  to: optionalYear,
  country: z
    .string()
    .regex(/^[A-Za-z]{2}$/)
    .transform((value) => value.toUpperCase())
    .optional()
    .catch(undefined),
  sort: z.enum(SORT_OPTIONS).catch("popular"),
  page: z.coerce.number().int().min(1).max(1000).catch(1),
});

export type TitleFilter = z.infer<typeof titleFilterSchema>;
/** Filters without pagination — identifies one result set. */
export type TitleFilterQuery = Omit<TitleFilter, "page">;

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Parses Next.js `searchParams` or `URLSearchParams` (first value wins). */
export function parseTitleFilter(input: SearchParamsRecord | URLSearchParams): TitleFilter {
  const entries =
    input instanceof URLSearchParams
      ? Object.fromEntries(input.entries())
      : Object.fromEntries(
          Object.entries(input).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
          ]),
        );
  return titleFilterSchema.parse(entries);
}

/** Serializes filters back to URL params, omitting defaults and empty values. */
export function toSearchParams(filter: Partial<TitleFilter>): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.type) params.set("type", filter.type);
  if (filter.lang) params.set("lang", filter.lang);
  if (filter.level?.length) params.set("level", filter.level.join(","));
  if (filter.genre) params.set("genre", filter.genre);
  if (filter.from) params.set("from", String(filter.from));
  if (filter.to) params.set("to", String(filter.to));
  if (filter.country) params.set("country", filter.country);
  if (filter.sort && filter.sort !== "popular") params.set("sort", filter.sort);
  if (filter.page && filter.page > 1) params.set("page", String(filter.page));
  return params;
}
