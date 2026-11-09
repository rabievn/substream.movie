import type { ReactNode } from "react";
import styles from "./title-grid.module.scss";

export function TitleGrid({ children }: { children: ReactNode }) {
  return (
    <ul role="list" className={styles.root}>
      {children}
    </ul>
  );
}
