import type { Metadata } from "next";
import type { SearchParamsRecord } from "@/features/catalog";
import { CatalogPage } from "../_catalog/catalog-page";

export const metadata: Metadata = { title: "Cartoons" };

export default function CartoonsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  return <CatalogPage section="cartoons" searchParams={searchParams} />;
}
