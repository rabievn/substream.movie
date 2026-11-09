import type { Dictionary } from "@/lib/i18n";

/** System lists are shown in the UI language; user lists keep their own names. */
export function getListName(list: { name: string; systemKey: string | null }, t: Dictionary) {
  if (list.systemKey === "watch-later") return t.lists.watchLater;
  if (list.systemKey === "favorites") return t.lists.favorites;
  return list.name;
}
