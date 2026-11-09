import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { titleCardSelect, toTitleCard } from "./title-select";

export async function getCollection(slug: string, locale: Locale) {
  const row = await db.collection.findUnique({
    where: { slug },
    select: {
      name: true,
      nameRu: true,
      description: true,
      descriptionRu: true,
      items: { orderBy: { order: "asc" }, select: { title: { select: titleCardSelect } } },
    },
  });
  if (!row) return null;
  return {
    name: locale === "ru" ? row.nameRu : row.name,
    description: locale === "ru" ? (row.descriptionRu ?? row.description) : row.description,
    titles: row.items.map(({ title }) => toTitleCard(title)),
  };
}
