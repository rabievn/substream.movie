import Link from "next/link";
import { Section } from "@/components/ui";
import type { Dictionary } from "@/lib/i18n";
import { LANGUAGES } from "../constants";
import styles from "./quick-links.module.scss";

export function QuickLinks({ t }: { t: Dictionary }) {
  const sortLinks = [
    { href: "/movies?sort=new", label: `${t.nav.movies}: ${t.catalog.sortNew}` },
    { href: "/movies?sort=imdb", label: `${t.nav.movies}: ${t.catalog.sortImdb}` },
    { href: "/series?sort=new", label: `${t.nav.series}: ${t.catalog.sortNew}` },
    { href: "/series?sort=imdb", label: `${t.nav.series}: ${t.catalog.sortImdb}` },
    { href: "/cartoons?level=A1,A2", label: `${t.nav.cartoons}: A1–A2` },
  ];

  return (
    <Section title={t.homePage.quickLinks}>
      <div className={styles.groups}>
        <nav aria-label={t.homePage.byLanguage}>
          <h3 className={styles.groupTitle}>{t.homePage.byLanguage}</h3>
          <ul role="list" className={styles.chips}>
            {LANGUAGES.map((lang) => (
              <li key={lang}>
                <Link href={`/movies?lang=${lang}`} className={styles.chip}>
                  {t.catalog.languages[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.homePage.bySort}>
          <h3 className={styles.groupTitle}>{t.homePage.bySort}</h3>
          <ul role="list" className={styles.chips}>
            {sortLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.chip}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Section>
  );
}
