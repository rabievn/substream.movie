import Link from "next/link";
import { format, type Dictionary } from "@/lib/i18n";
import type { CollectionSummary } from "../server/home-queries";
import styles from "./collection-grid.module.scss";
import { TitlePoster } from "./title-poster";

interface CollectionGridProps {
  collections: CollectionSummary[];
  t: Dictionary;
}

export function CollectionGrid({ collections, t }: CollectionGridProps) {
  return (
    <ul role="list" className={styles.root}>
      {collections.map((collection) => (
        <li key={collection.id}>
          <Link href={`/collections/${collection.slug}`} className={styles.card}>
            <div className={styles.stack} aria-hidden="true">
              {collection.previews.map((title) => (
                <TitlePoster
                  key={title.slug}
                  title={title.originalTitle}
                  posterUrl={title.posterUrl}
                  seed={title.slug}
                  sizes="120px"
                  className={styles.stackItem}
                />
              ))}
            </div>
            <div className={styles.text}>
              <h3 className={styles.name}>{collection.name}</h3>
              <p className={styles.count}>
                {format(t.homePage.titlesCount, { count: collection.count })}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
