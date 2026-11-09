import { getCurrentUser } from "@/features/auth/server";
import { saveWordSchema } from "@/features/dictionary";
import { listSavedWords, saveWord, WordLimitError } from "@/features/dictionary/server";
import { jsonError, parseJsonBody } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "unauthorized");
  return Response.json(await listSavedWords(user.id));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "unauthorized");
  const body = await parseJsonBody(request, saveWordSchema);
  if (body.error) return body.error;

  try {
    return Response.json(await saveWord(user.id, body.data), { status: 201 });
  } catch (error) {
    if (error instanceof WordLimitError) return jsonError(409, "word_limit_reached");
    throw error;
  }
}
