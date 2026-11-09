import Link from "next/link";
import styles from "./logo.module.scss";

/** Original wordmark: a play glyph above two "subtitle" bars. */
export function Logo() {
  return (
    <Link href="/" className={styles.root} aria-label="substream.movie — home">
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" className={styles.markBg} />
        <path d="M12 7.5v9l7.5-4.5z" className={styles.markFg} />
        <rect x="7" y="20" width="18" height="2.5" rx="1.25" className={styles.markFg} />
        <rect x="10" y="24.5" width="12" height="2.5" rx="1.25" className={styles.markSub} />
      </svg>
      <span className={styles.word}>
        substream<span className={styles.tld}>.movie</span>
      </span>
    </Link>
  );
}
