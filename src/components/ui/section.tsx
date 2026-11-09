import clsx from "clsx";
import Link from "next/link";
import { useId, type ReactNode } from "react";
import styles from "./section.module.scss";

export interface SectionProps {
  title: string;
  /** Optional "See all" link */
  action?: { href: string; label: string };
  /** Leaves room on the right for carousel arrows */
  hasCarousel?: boolean;
  className?: string;
  children: ReactNode;
}

export function Section({ title, action, hasCarousel = false, className, children }: SectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={clsx(styles.root, className)}>
      <header className={clsx(styles.header, hasCarousel && styles.hasCarousel)}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {action ? (
          <Link href={action.href} className={styles.action}>
            {action.label}
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  );
}
