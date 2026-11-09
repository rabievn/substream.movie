import Link from "next/link";
import { Container } from "@/components/ui";
import { SITE_CONFIG } from "@/config/site";
import { getDictionary } from "@/lib/i18n/get-locale";
import { Logo } from "./logo";
import { MAIN_NAV_ITEMS } from "./nav-items";
import styles from "./site-footer.module.scss";

export async function SiteFooter() {
  const t = await getDictionary();
  const year = new Date().getFullYear();

  const serviceLinks = [
    { href: "/help", label: t.footer.help },
    { href: "/requests", label: t.footer.requests },
    { href: "/subscription", label: t.footer.subscription },
  ];

  return (
    <footer className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.nav.mainNavigation}>
          <ul role="list" className={styles.links}>
            {MAIN_NAV_ITEMS.map(({ href, labelKey }) => (
              <li key={href}>
                <Link href={href}>{t.nav[labelKey]}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul role="list" className={styles.links}>
          {serviceLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
        <p className={styles.copyright}>
          © {year} {SITE_CONFIG.name}. {t.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
