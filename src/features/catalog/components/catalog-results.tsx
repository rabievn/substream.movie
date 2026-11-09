"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useGetTitlesInfiniteQuery } from "../api/catalog-api";
import type { TitleFilterQuery } from "../schemas/title-filter-schema";
import type { TitlePage } from "../types";
import styles from "./catalog-results.module.scss";
import { TitleCard } from "./title-card";
import { TitleGrid } from "./title-grid";

interface CatalogResultsProps {
  /** Page rendered on the server. */
  firstPage: TitlePage;
  query: TitleFilterQuery;
}

/**
 * Server-rendered first page + client "Show more" through RTK Query's infinite query.
 * Remount with a `key` per filter set so pagination resets when filters change.
 */
export function CatalogResults({ firstPage, query }: CatalogResultsProps) {
  const { t, locale } = useI18n();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const nextPage = firstPage.nextPage;

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useGetTitlesInfiniteQuery(
    query,
    {
      initialPageParam: nextPage ?? 1,
      skip: !isLoadingMore || nextPage === null,
    },
  );

  const extraItems = data?.pages.flatMap((page) => page.items) ?? [];
  const items = [...firstPage.items, ...extraItems];
  const canLoadMore = isLoadingMore ? hasNextPage : nextPage !== null;

  const handleShowMore = () => {
    if (!isLoadingMore) setIsLoadingMore(true);
    else void fetchNextPage();
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{t.catalog.empty}</p>
        <p>{t.catalog.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <TitleGrid>
        {items.map((title, index) => (
          <li key={title.id}>
            <TitleCard title={title} locale={locale} isPriority={index < 6} />
          </li>
        ))}
      </TitleGrid>
      {isError ? (
        <p role="alert" className={styles.error}>
          {t.common.errorTitle}
        </p>
      ) : null}
      {canLoadMore || isFetching ? (
        <Button variant="secondary" size="lg" onClick={handleShowMore} disabled={isFetching}>
          {isFetching ? t.catalog.loadingMore : t.catalog.showMore}
        </Button>
      ) : null}
    </div>
  );
}
