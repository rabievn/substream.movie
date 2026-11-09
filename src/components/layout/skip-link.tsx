import styles from "./skip-link.module.scss";

export const MAIN_CONTENT_ID = "main-content";

export function SkipLink({ label }: { label: string }) {
  return (
    <a href={`#${MAIN_CONTENT_ID}`} className={styles.root}>
      {label}
    </a>
  );
}
