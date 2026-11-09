import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Carousel, Section } from "@/components/ui";
import { getDisplayTitle, LevelBadge, TitlePoster, type TitleCardData } from "@/features/catalog";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./upcoming-section.module.scss";

export interface UpcomingItem extends TitleCardData {
  releaseDate: string;
  description: string;
  genreNames: string[];
}

interface UpcomingSectionProps {
  items: UpcomingItem[];
  t: Dictionary;
  locale: Locale;
  /** Slot for the "Notify me" control of each item. */
  renderAction?: (item: UpcomingItem) => ReactNode;
}

export function UpcomingSection({ items, t, locale, renderAction }: UpcomingSectionProps) {
  if (items.length === 0) return null;
  const dateFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" });

  return (
    <Section title={t.homePage.comingSoon} hasCarousel>
      <Carousel
        label={t.homePage.comingSoon}
        previousLabel={t.homePage.previous}
        nextLabel={t.homePage.next}
        itemSize="wide"
      >
        {items.map((item) => (
          <li key={item.id}>
            <article className={styles.card}>
              <TitlePoster
                title={item.originalTitle}
                posterUrl={item.posterUrl}
                seed={item.slug}
                sizes="120px"
                className={styles.poster}
              />
              <div className={styles.body}>
                <p className={styles.date}>
                  <CalendarDays aria-hidden="true" size={14} />
                  <time dateTime={item.releaseDate}>
                    {format(t.homePage.releaseOn, {
                      date: dateFormat.format(new Date(item.releaseDate)),
                    })}
                  </time>
                </p>
                <h3 className={styles.title}>
                  <Link href={`/title/${item.slug}`} className={styles.link}>
                    {getDisplayTitle(item, locale)}
                  </Link>
                </h3>
                <p className={styles.genres}>
                  <LevelBadge level={item.cefrLevel} /> {item.genreNames.join(", ")}
                </p>
                <p className={styles.description}>{item.description}</p>
                {renderAction ? <div className={styles.action}>{renderAction(item)}</div> : null}
              </div>
            </article>
          </li>
        ))}
      </Carousel>
    </Section>
  );
}
