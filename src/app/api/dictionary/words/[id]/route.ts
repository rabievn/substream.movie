import { z } from "zod";
import { getCurrentUser } from "@/features/auth/server";
import { reviewWordSchema, updateWordSchema } from "@/features/dictionary";
import { deleteSavedWord, reviewSavedWord, updateSavedWord } from "@/features/dictionary/server";
import { jsonError, parseJsonBody } from "@/lib/api-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** PATCH accepts either a review result ({ isRemembered }) or field updates. */
const patchSchema = z.union([reviewWordSchema, updateWordSchema]);

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "unauthorized");
  const body = await parseJsonBody(request, patchSchema);
  if (body.error) return body.error;
  const { id } = await params;

  const isFound =
    "isRemembered" in body.data
      ? await reviewSavedWord(user.id, id, body.data.isRemembered)
      : await updateSavedWord(user.id, id, body.data);
  return isFound ? new Response(null, { status: 204 }) : jsonError(404, "not_found");
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "unauthorized");
  const isDeleted = await deleteSavedWord(user.id, (await params).id);
  return isDeleted ? new Response(null, { status: 204 }) : jsonError(404, "not_found");
}
