import { Play } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Carousel, Section } from "@/components/ui";
import { TitlePoster } from "@/features/catalog";
import { format, type Dictionary } from "@/lib/i18n";
import type { ContinueWatchingItem } from "../server/watch-progress";
import styles from "./continue-watching-row.module.scss";

interface ContinueWatchingRowProps {
  items: ContinueWatchingItem[];
  t: Dictionary;
}

export function ContinueWatchingRow({ items, t }: ContinueWatchingRowProps) {
  if (items.length === 0) return null;

  return (
    <Section title={t.homePage.continueWatching} hasCarousel>
      <Carousel
        label={t.homePage.continueWatching}
        previousLabel={t.homePage.previous}
        nextLabel={t.homePage.next}
        itemSize="wide"
      >
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className={styles.card}>
              <div className={styles.media}>
                <TitlePoster
                  title={item.originalTitle}
                  posterUrl={item.posterUrl}
                  seed={item.slug}
                  sizes="(min-width: 1024px) 400px, 85vw"
                  className={styles.poster}
                />
                <span className={styles.play} aria-hidden="true">
                  <Play />
                </span>
                <span
                  className={styles.progress}
                  style={{ "--progress": `${Math.round(item.progress * 100)}%` } as CSSProperties}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(item.progress * 100)}
                  aria-label={item.displayTitle}
                />
              </div>
              <div className={styles.text}>
                <h3 className={styles.title}>{item.displayTitle}</h3>
                <p className={styles.meta}>
                  {item.episode ? `${format(t.player.episodeLabel, item.episode)} · ` : ""}
                  {format(t.homePage.minutesLeft, {
                    count: Math.max(1, Math.round(item.remainingSeconds / 60)),
                  })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </Carousel>
    </Section>
  );
}
