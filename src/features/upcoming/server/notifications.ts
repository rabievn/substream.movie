import "server-only";
import { db } from "@/lib/db";

/** Title ids the user asked to be notified about. */
export async function getNotificationTitleIds(userId: string) {
  const rows = await db.releaseNotification.findMany({
    where: { userId },
    select: { titleId: true },
  });
  return rows.map((row) => row.titleId);
}
