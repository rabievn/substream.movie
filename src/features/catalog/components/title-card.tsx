import { Star } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { TitleCardData } from "../types";
import { getDisplayTitle } from "../utils";
import { LevelBadge } from "./level-badge";
import styles from "./title-card.module.scss";
import { TitlePoster } from "./title-poster";

interface TitleCardProps {
  title: TitleCardData;
  locale: Locale;
  isPriority?: boolean;
}

export function TitleCard({ title, locale, isPriority = false }: TitleCardProps) {
  const displayTitle = getDisplayTitle(title, locale);

  return (
    <article className={styles.root}>
      <Link href={`/title/${title.slug}`} className={styles.link}>
        <TitlePoster
          title={title.originalTitle}
          posterUrl={title.posterUrl}
          seed={title.slug}
          isPriority={isPriority}
        />
        <div className={styles.overlay}>
          <LevelBadge level={title.cefrLevel} />
          {title.imdbRating ? (
            <span className={styles.rating} aria-label={`IMDb ${title.imdbRating}`}>
              <Star aria-hidden="true" />
              {title.imdbRating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <h3 className={styles.title}>{displayTitle}</h3>
      </Link>
      <p className={styles.meta}>
        {title.year}
        {displayTitle !== title.originalTitle ? ` · ${title.originalTitle}` : null}
      </p>
    </article>
  );
}
