import type { NextRequest } from "next/server";
import { parseTitleFilter } from "@/features/catalog";
import { getTitles } from "@/features/catalog/server";

/** GET /api/titles?type=MOVIE&level=B1&sort=new&page=2 */
export async function GET(request: NextRequest) {
  const filter = parseTitleFilter(request.nextUrl.searchParams);
  return Response.json(await getTitles(filter));
}
