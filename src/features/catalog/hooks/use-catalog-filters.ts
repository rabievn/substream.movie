"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { parseTitleFilter, toSearchParams, type TitleFilter } from "../schemas/title-filter-schema";

/** Reads catalog filters from the URL and writes changes back (the URL is the source of truth). */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filter = useMemo(() => parseTitleFilter(new URLSearchParams(searchParams)), [searchParams]);

  const navigate = useCallback(
    (next: Partial<TitleFilter>) => {
      const query = toSearchParams(next).toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  /** Any filter change returns to page 1. */
  const setFilter = useCallback(
    (patch: Partial<TitleFilter>) => navigate({ ...filter, ...patch, page: 1 }),
    [filter, navigate],
  );

  const resetFilters = useCallback(() => navigate({ sort: filter.sort }), [filter.sort, navigate]);

  const activeCount =
    (filter.lang ? 1 : 0) +
    (filter.level?.length ? 1 : 0) +
    (filter.genre ? 1 : 0) +
    (filter.from || filter.to ? 1 : 0) +
    (filter.country ? 1 : 0);

  return { filter, setFilter, resetFilters, activeCount, isPending };
}
