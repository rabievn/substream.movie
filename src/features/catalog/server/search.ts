import "server-only";
import { db } from "@/lib/db";
import { releasedWhere, titleCardSelect, toTitleCard } from "./title-select";

export const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 24;

/** Case-insensitive search over original/localized titles and people names. */
export async function searchCatalog(rawQuery: string) {
  const query = rawQuery.trim().slice(0, 100);
  if (query.length < MIN_SEARCH_LENGTH) return { query, titles: [], people: [] };

  const contains = { contains: query, mode: "insensitive" as const };
  const [titles, people] = await Promise.all([
    db.title.findMany({
      where: {
        AND: [releasedWhere(), { OR: [{ originalTitle: contains }, { localizedTitle: contains }] }],
      },
      orderBy: { popularity: "desc" },
      take: MAX_RESULTS,
      select: titleCardSelect,
    }),
    db.person.findMany({
      where: { name: contains },
      orderBy: { popularity: "desc" },
      take: MAX_RESULTS,
      select: { id: true, slug: true, name: true, photoUrl: true },
    }),
  ]);
  return { query, titles: titles.map(toTitleCard), people };
}
