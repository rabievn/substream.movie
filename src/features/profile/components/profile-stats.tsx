import type { Dictionary } from "@/lib/i18n";
import styles from "./card.module.scss";

interface ProfileStatsProps {
  stats: { savedWords: number; titlesStarted: number };
  t: Dictionary["profile"];
}

export function ProfileStats({ stats, t }: ProfileStatsProps) {
  return (
    <section className={styles.root} aria-labelledby="stats-heading">
      <h2 id="stats-heading" className={styles.heading}>
        {t.stats}
      </h2>
      <dl className={styles.stats}>
        <div>
          <dt className={styles.muted}>{t.savedWords}</dt>
          <dd className={styles.big}>{stats.savedWords}</dd>
        </div>
        <div>
          <dt className={styles.muted}>{t.titlesStarted}</dt>
          <dd className={styles.big}>{stats.titlesStarted}</dd>
        </div>
      </dl>
    </section>
  );
}
