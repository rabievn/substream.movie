import type { NextRequest } from "next/server";
import { z } from "zod";
import { CATALOG_PAGE_SIZE, parseTitleFilter } from "@/features/catalog";
import { getTitles } from "@/features/catalog/server";

const pageSizeSchema = z.coerce.number().int().min(1).max(48).catch(CATALOG_PAGE_SIZE);

/** GET /api/titles?type=MOVIE&level=B1&sort=new&page=2&pageSize=12 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filter = parseTitleFilter(searchParams);
  const pageSize = pageSizeSchema.parse(searchParams.get("pageSize") ?? undefined);
  return Response.json(await getTitles(filter, pageSize));
}
