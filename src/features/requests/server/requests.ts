import "server-only";
import { db } from "@/lib/db";

export function getUserRequests(userId: string) {
  return db.titleRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, year: true, status: true, createdAt: true },
  });
}
