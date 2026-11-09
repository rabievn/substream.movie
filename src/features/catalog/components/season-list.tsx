"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { format } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/i18n-provider";
import type { SeasonDetails } from "../server/get-title-details";
import styles from "./season-list.module.scss";

interface SeasonListProps {
  titleSlug: string;
  seasons: SeasonDetails[];
}

export function SeasonList({ titleSlug, seasons }: SeasonListProps) {
  const { t } = useI18n();
  const firstSeason = seasons[0];
  if (!firstSeason) return null;

  return (
    <Tabs defaultValue={String(firstSeason.number)} className={styles.root}>
      <TabsList aria-label={t.titlePage.seasons} className={styles.tabs}>
        {seasons.map((season) => (
          <TabsTrigger key={season.id} value={String(season.number)}>
            {format(t.titlePage.season, { number: season.number })}
          </TabsTrigger>
        ))}
      </TabsList>
      {seasons.map((season) => (
        <TabsContent key={season.id} value={String(season.number)}>
          <ol className={styles.episodes}>
            {season.episodes.map((episode) => (
              <li key={episode.id}>
                <Link href={`/watch/${titleSlug}?e=${episode.id}`} className={styles.episode}>
                  <span className={styles.number}>{episode.number}</span>
                  <span className={styles.name}>
                    {episode.name}
                    <span className={styles.meta}>
                      {format(t.catalog.minutes, {
                        count: Math.round(episode.durationSeconds / 60),
                      })}
                    </span>
                  </span>
                  <Play aria-hidden="true" className={styles.icon} />
                </Link>
              </li>
            ))}
          </ol>
        </TabsContent>
      ))}
    </Tabs>
  );
}
