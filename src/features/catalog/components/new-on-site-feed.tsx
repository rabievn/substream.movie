"use client";

import { useState, type ReactNode } from "react";
import { SelectField, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useGetTitlesPageQuery } from "../api/catalog-api";
import { LANGUAGES } from "../constants";
import { titleFilterSchema } from "../schemas/title-filter-schema";
import type { Language, TitleCardData } from "../types";
import styles from "./new-on-site-feed.module.scss";
import { TitleCard } from "./title-card";
import { TitleGrid } from "./title-grid";

const FEED_SIZE = 12;
type FeedTab = "new" | "popular";

interface NewOnSiteFeedProps {
  /** SSR data for the default state (tab "new", all languages). */
  initialItems: TitleCardData[];
}

export function NewOnSiteFeed({ initialItems }: NewOnSiteFeedProps) {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState<FeedTab>("new");
  const [language, setLanguage] = useState<Language | undefined>(undefined);
  const isDefaultState = tab === "new" && !language;

  const { data, isFetching } = useGetTitlesPageQuery(
    { sort: tab, lang: language, pageSize: FEED_SIZE },
    { skip: isDefaultState },
  );
  const items = isDefaultState ? initialItems : data?.items;

  let results: ReactNode;
  if (!items) {
    results = (
      <TitleGrid>
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index}>
            <Skeleton height={260} radius="md" />
          </li>
        ))}
      </TitleGrid>
    );
  } else if (items.length === 0) {
    results = <p className={styles.empty}>{t.catalog.empty}</p>;
  } else {
    results = (
      <TitleGrid>
        {items.map((title) => (
          <li key={title.id}>
            <TitleCard title={title} locale={locale} />
          </li>
        ))}
      </TitleGrid>
    );
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value === "popular" ? "popular" : "new")}
      className={styles.root}
    >
      <div className={styles.controls}>
        <TabsList aria-label={t.homePage.newOnSite}>
          <TabsTrigger value="new">{t.homePage.tabNew}</TabsTrigger>
          <TabsTrigger value="popular">{t.homePage.tabPopular}</TabsTrigger>
        </TabsList>
        <SelectField
          label={t.catalog.language}
          className={styles.language}
          value={language ?? ""}
          options={[
            { value: "", label: t.homePage.allLanguages },
            ...LANGUAGES.map((lang) => ({ value: lang, label: t.catalog.languages[lang] })),
          ]}
          onChange={(event) => setLanguage(titleFilterSchema.shape.lang.parse(event.target.value))}
        />
      </div>
      {/* Both panels stay mounted so every tab's aria-controls points to a real element. */}
      {(["new", "popular"] as const).map((value) => (
        <TabsContent
          key={value}
          value={value}
          forceMount
          hidden={value !== tab}
          aria-busy={isFetching}
        >
          {value === tab ? results : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
