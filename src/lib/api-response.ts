import "server-only";
import type { z } from "zod";

export const jsonError = (status: number, error: string, details?: unknown) =>
  Response.json({ error, details }, { status });

/** Parses a JSON body with a zod schema; returns either data or a ready 400 response. */
export async function parseJsonBody<Schema extends z.ZodType>(
  request: Request,
  schema: Schema,
): Promise<{ data: z.infer<Schema>; error?: never } | { data?: never; error: Response }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: jsonError(400, "invalid_json") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { error: jsonError(400, "invalid_body", parsed.error.issues) };
  return { data: parsed.data };
}
