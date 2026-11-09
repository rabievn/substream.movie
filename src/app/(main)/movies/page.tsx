import type { Metadata } from "next";
import type { SearchParamsRecord } from "@/features/catalog";
import { CatalogPage } from "../_catalog/catalog-page";

export const metadata: Metadata = { title: "Movies" };

export default function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  return <CatalogPage section="movies" searchParams={searchParams} />;
}
