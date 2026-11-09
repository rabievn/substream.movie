import type { Metadata } from "next";
import type { SearchParamsRecord } from "@/features/catalog";
import { CatalogPage } from "../_catalog/catalog-page";

export const metadata: Metadata = { title: "Series" };

export default function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  return <CatalogPage section="series" searchParams={searchParams} />;
}
