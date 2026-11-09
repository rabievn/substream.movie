import "server-only";
import { titleCardSelect, toTitleCard } from "@/features/catalog/server";
import { db } from "@/lib/db";

export async function getUserLists(userId: string) {
  const lists = await db.list.findMany({
    where: { userId },
    orderBy: [{ systemKey: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      systemKey: true,
      items: { orderBy: { addedAt: "desc" }, select: { title: { select: titleCardSelect } } },
    },
  });
  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    systemKey: list.systemKey,
    titles: list.items.map(({ title }) => toTitleCard(title)),
  }));
}

/** Lists of the user with a flag for whether `titleId` is in each. */
export async function getListMembership(userId: string, titleId: string) {
  const lists = await db.list.findMany({
    where: { userId },
    orderBy: [{ systemKey: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      systemKey: true,
      items: { where: { titleId }, select: { titleId: true } },
    },
  });
  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    systemKey: list.systemKey,
    hasTitle: list.items.length > 0,
  }));
}

export type ListMembership = Awaited<ReturnType<typeof getListMembership>>[number];
