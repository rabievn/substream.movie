import { getCurrentUser } from "@/features/auth/server";
import { updateWatchProgressSchema } from "@/features/watch-progress";
import { upsertWatchProgress } from "@/features/watch-progress/server";
import { jsonError, parseJsonBody } from "@/lib/api-response";

async function handleUpdate(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "unauthorized");
  const body = await parseJsonBody(request, updateWatchProgressSchema);
  if (body.error) return body.error;
  const isSaved = await upsertWatchProgress(user.id, body.data);
  return isSaved ? new Response(null, { status: 204 }) : jsonError(404, "title_not_found");
}

/** PUT /api/watch-progress — regular saves (RTK Query). */
export const PUT = handleUpdate;
/** POST /api/watch-progress — navigator.sendBeacon on page hide (beacons are POST-only). */
export const POST = handleUpdate;
